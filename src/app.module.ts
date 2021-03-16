import { WebsoketModule } from './modules/websocket/websoket.module';
import { OrderModule } from './modules/order/order.module';
import { UserModule } from './modules/user/user.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as PostgressConnectionStringParser from "pg-connection-string";
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './modules/auth/controller/auth-controller.controller';
import { JWT_SECRET_KEY } from './modules/config/conts';
import { JwtStrategy } from './modules/auth/service/jwt-auth-provider.service';
import { JwtModule } from '@nestjs/jwt';
import { User } from './modules/user/entity/user';
import { AuthService } from './modules/auth/service/auth.service';
import { GoogleAuthProvider } from './modules/auth/service/google-auth-provider.service';
import { UserService } from 'src/modules/user/servise/user.service';
import { WebSocketGateway } from '@nestjs/websockets';

const databaseUrl: string = process.env.API_RANDOM_ORDER_DATABASE_URL;
const connectionOptions = databaseUrl ? PostgressConnectionStringParser.parse(databaseUrl) : null;

@WebSocketGateway(80, { namespace: 'events' })
@WebSocketGateway(81, { transports: ['websocket'] })
@Module({
  imports: [
    WebsoketModule,
    OrderModule,
    UserModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.register({
      secret: JWT_SECRET_KEY,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.API_RANDOM_ORDER_DB_HOST || connectionOptions.host,
      port: Number.parseInt(process.env.API_RANDOM_ORDER_DB_PORT || connectionOptions.port || '5432'),
      username: process.env.API_RANDOM_ORDER_DB_USERNAME || connectionOptions.user,
      password: process.env.API_RANDOM_ORDER_DB_PASSWORD || connectionOptions.password,
      database: process.env.API_RANDOM_ORDER_DB_DATABASE || connectionOptions.database,
      ssl: { rejectUnauthorized: false },
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [
    AppController,
    AuthController,
  ],
  providers: [
    GoogleAuthProvider,
    AuthService,
    JwtStrategy,
    AppService
  ],
})
export class AppModule { }
