import { createServer, type ServerResponse } from 'node:http';
import { homeData, viewerData, signedInViewerData } from './data.mts';
import type { ApiResponse, ApiErrorResponse } from '../src/shared/types/index.ts';
import type { HomepageData, ViewerData } from '../src/features/home/types/index.ts';

const port = Number(process.env.BACKEND_PORT ?? 4000);
const host = process.env.BACKEND_HOST ?? '127.0.0.1';
const homeScenario = process.env.BACKEND_HOME_SCENARIO ?? 'normal';
const viewerScenario = process.env.BACKEND_VIEWER_SCENARIO ?? 'normal';
const corsOrigin = process.env.BACKEND_CORS_ORIGIN;

if (!['normal', 'slow', 'empty', 'error'].includes(homeScenario))
  throw new Error(
    `Invalid BACKEND_HOME_SCENARIO: ${homeScenario}. Use normal, slow, empty, or error.`,
  );
if (!['normal', 'slow', 'signed-in', 'error'].includes(viewerScenario))
  throw new Error(
    `Invalid BACKEND_VIEWER_SCENARIO: ${viewerScenario}. Use normal, slow, signed-in, or error. Empty is only supported by BACKEND_HOME_SCENARIO.`,
  );
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid BACKEND_PORT');

function sendJson(
  response: ServerResponse,
  status: number,
  body: ApiResponse<HomepageData | ViewerData> | ApiErrorResponse,
) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  response.end(JSON.stringify(body));
}

function failure(status: number, code: string, message: string): ApiErrorResponse {
  return {
    meta: { success: false, error_code: code, error_fields: [] },
    message,
    error_status: status,
  };
}

const server = createServer(async (request, response) => {
  response.setHeader('Vary', 'Origin');
  if (corsOrigin && request.headers.origin === corsOrigin)
    response.setHeader('Access-Control-Allow-Origin', corsOrigin);
  const path = new URL(request.url ?? '/', 'http://backend.local').pathname;
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    sendJson(response, 405, failure(405, 'METHOD_NOT_ALLOWED', 'Only GET is supported.'));
    return;
  }
  if (path !== '/home' && path !== '/viewer') {
    sendJson(response, 404, failure(404, 'NOT_FOUND', 'Resource not found.'));
    return;
  }
  const scenario = path === '/home' ? homeScenario : viewerScenario;
  if (scenario === 'slow') await new Promise((resolve) => setTimeout(resolve, 800));
  if (scenario === 'error') {
    sendJson(
      response,
      503,
      failure(503, 'SERVICE_UNAVAILABLE', 'اطلاعات موقتاً در دسترس نیستند. دوباره تلاش کنید.'),
    );
    return;
  }
  if (path === '/home') {
    const data: HomepageData =
      scenario === 'empty'
        ? { ...homeData, services: [], banner: { ...homeData.banner, serviceId: '' } }
        : homeData;
    sendJson(response, 200, { meta: { success: true }, data });
  } else {
    sendJson(response, 200, {
      meta: { success: true },
      data: scenario === 'signed-in' ? signedInViewerData : viewerData,
    });
  }
});

server.listen(port, host, () =>
  console.info(`Backend ready at http://${host}:${port}: GET /home, GET /viewer`),
);
for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
