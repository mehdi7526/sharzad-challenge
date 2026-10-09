import { createServer, type ServerResponse } from 'node:http';
import { homeFixture, viewerFixture, signedInViewerFixture } from './fixtures.mts';
import type { ApiResponse, ApiErrorResponse } from '../../src/shared/lib/api-response.ts';
import type { HomepageData, ViewerData } from '../../src/features/home/types/index.ts';

const port = Number(process.env.MOCK_PORT ?? 4000);
const host = process.env.MOCK_HOST ?? '127.0.0.1';
const homeScenario = process.env.MOCK_HOME_SCENARIO ?? 'normal';
const viewerScenario = process.env.MOCK_VIEWER_SCENARIO ?? 'normal';

if (!['normal', 'slow', 'empty', 'error'].includes(homeScenario))
  throw new Error('Invalid MOCK_HOME_SCENARIO');
if (!['normal', 'slow', 'signed-in', 'error'].includes(viewerScenario))
  throw new Error('Invalid MOCK_VIEWER_SCENARIO');
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid MOCK_PORT');

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
  const path = new URL(request.url ?? '/', 'http://mock.local').pathname;
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
        ? { ...homeFixture, services: [], banner: { ...homeFixture.banner, serviceId: '' } }
        : homeFixture;
    sendJson(response, 200, { meta: { success: true }, data });
  } else {
    sendJson(response, 200, {
      meta: { success: true },
      data: scenario === 'signed-in' ? signedInViewerFixture : viewerFixture,
    });
  }
});

server.listen(port, host, () =>
  console.info(`Mock backend ready at http://${host}:${port}: GET /home, GET /viewer`),
);
for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
