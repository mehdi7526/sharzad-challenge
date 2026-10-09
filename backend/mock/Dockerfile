FROM node:22-alpine
WORKDIR /app
COPY backend ./backend
COPY src/features/home/types ./src/features/home/types
COPY src/shared/lib/api-response.ts ./src/shared/lib/api-response.ts
USER node
ENV MOCK_HOST=0.0.0.0
EXPOSE 4000
CMD ["node", "--experimental-strip-types", "backend/mock/server.mts"]
