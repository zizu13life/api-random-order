import { AuthService } from './modules/auth/services/auth.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as PostgressConnectionStringParser from "pg-connection-string";
import { PassportModule } from '@nestjs/passport';
import { GoogleAuthProvider } from './modules/auth/services/google-auth-provider.service';
import { AuthController } from './modules/auth/controller/auth-controller.controller';

const databaseUrl: string = process.env.API_RANDOM_ORDER_DATABASE_URL;
const connectionOptions = databaseUrl ? PostgressConnectionStringParser.parse(databaseUrl) : null;

@Module({
  imports: [

    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.API_RANDOM_ORDER_DB_HOST || connectionOptions.host,
      port: Number.parseInt(process.env.API_RANDOM_ORDER_DB_PORT || connectionOptions.port || '5432'),
      username: process.env.API_RANDOM_ORDER_DB_USERNAME || connectionOptions.user,
      password: process.env.API_RANDOM_ORDER_DB_PASSWORD || connectionOptions.password,
      database: process.env.API_RANDOM_ORDER_DB_DATABASE || connectionOptions.database,
      ssl: { rejectUnauthorized: false },
      entities: [],
      synchronize: true,
    }),
  ],
  controllers: [
    AppController,
    AuthController,
  ], providers: [
    AuthService,
    GoogleAuthProvider,
    AppService
  ],
})
export class AppModule { }
