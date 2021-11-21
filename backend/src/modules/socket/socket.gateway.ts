import { Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Server } from 'ws';
import { Socket } from 'socket.io';
import { SocketService } from './socket.service';


@WebSocketGateway()
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(private cacheManager: SocketService) { }

  @WebSocketServer()
  server: Server;

  //public connectedSockets: { [key: string]: any[] } = {};
  public connectedSockets = [];

  private logger: Logger = new Logger('AppGateway');

  async handleConnection(client: Socket, ...args: any[]) {
    console.log(client.id);
    client.emit('Notification', { data: "abcd" });
  }

  //redis 127.0.0.1:6379

  afterInit(server: any) {
    this.logger.log("started");
  }

  handleDisconnect(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }


  @SubscribeMessage('Notification')
  async handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const clientDetails = { clientId: client.id, client: client };
    this.connectedSockets.push(clientDetails);
    await this.cacheManager.set(data.userId, client.id);
    client.emit('Notification', { data: "Subscription Added" });
    return { data: "Subscription Added" };
  }
}
