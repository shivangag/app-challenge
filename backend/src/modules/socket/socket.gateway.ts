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

  private logger: Logger = new Logger('SocketGateway');

  async handleConnection(client: Socket, ...args: any[]) {
    client.emit('Notification', { data: "abcd" });
    // return { data: "abcd" };
  }

  afterInit(server: any) {
    this.logger.log("started")
  }

  async handleDisconnect(client: Socket, ...args: any[]) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.connectedSockets = this.connectedSockets.filter((socket) => socket.clientId !== client.id);
    await this.cacheManager.del(client.id);
    this.logger.log("Deleted disconnected User");
  }


  @SubscribeMessage('Notification')
  async handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const clientDetails = { clientId: client.id, client: client };
    this.connectedSockets.push(clientDetails);
    await this.cacheManager.set(client.id, data.userId);
    client.emit('Notification', { data: "Subscription Added" });
    //return { data: "Subscription Added" };
  }

  async sendNotification(userid, data, type) {
    this.logger.log("function called");
    const payloadData = {
      type:type,
      data:data.dataValues
    }
    for (let i = 0; i < this.connectedSockets.length; i++) {
      this.logger.log("in loop");
      const userID = await this.cacheManager.get(this.connectedSockets[i].clientId);
      if (userid !== userID) {
        this.connectedSockets[i].client.emit('Notification', { payload: payloadData });
      }
    }
    return 1;
  }
}
