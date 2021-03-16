import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { API_HOST, WEB_HOST } from 'src/modules/config/conts';
import { SocketIoAdapter } from './modules/websocket/adapter/adatapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: WEB_HOST,
    credentials: true,
  });
  app.use(cookieParser());
  app.useWebSocketAdapter(new SocketIoAdapter(app, [WEB_HOST]));
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
