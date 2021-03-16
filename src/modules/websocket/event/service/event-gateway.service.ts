import { UserService } from './../../../user/servise/user.service';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import * as cookieParser from 'cookie-parser';
import * as cookie from 'cookie';

import { verify } from 'jsonwebtoken';
import { from, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { JWT_SECRET_KEY } from 'src/modules/config/conts';
import { WebsocketEvent, WebsocketEventType } from '../dto/WebsocketEvent';
import { AuthJWT } from 'src/modules/auth/dto/auth-models';
import { User } from 'src/modules/user/entity/user';

@WebSocketGateway({ transports: ['websocket', 'polling'], } as SocketIO.ServerOptions)
@WebSocketGateway()
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  private server: Server;

  private eventEmitter = new Subject<WebsocketEvent<any>>();

  constructor(private userService: UserService) { }

  emit<T>(value?: WebsocketEvent<T>) {
    this.eventEmitter.next(value);
  }

  @SubscribeMessage('events')
  findAll(@ConnectedSocket() client: SocketIO.Socket, @MessageBody() data: any): Observable<WsResponse<WebsocketEvent<any>>> {
    this.checkTokenAndSendNotification(client);
    return this.eventEmitter.pipe(map(item => ({ event: 'events', data: item })));
  }

  afterInit(server: Server) {

  }

  checkTokenAndSendNotification(client: SocketIO.Socket) {
    const decoded = this.getParsedToken(client);
    if (decoded == null){
      client.disconnect(true);
    }else{
      this.sendUserConectEvent(decoded.userId).then();
    }
  }

  handleConnection(client: SocketIO.Socket, ...args: any[]) {

  }

  getParsedToken(client: SocketIO.Socket) {
    try {
      return verify(cookie.parse(client.request.headers.cookie)['Authorization'], JWT_SECRET_KEY) as AuthJWT;
    } catch (error) {

    }
  }

  handleDisconnect(client: SocketIO.Socket) {
    const auth = this.getParsedToken(client);
    if (auth) {
      this.sendUserDisconectEvent(auth.userId).then();
    }
  }

  async sendUserConectEvent(userId: number) {
    this.emit({
      type: WebsocketEventType.USER_CONNECTED,
      data: await this.userService.findOne(userId),
    } as WebsocketEvent<User>);
  }

  async sendUserDisconectEvent(userId: number) {
    this.emit({
      type: WebsocketEventType.USER_DISCONNECTED,
      data: await this.userService.findOne(userId),
    } as WebsocketEvent<User>);
  }
}