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
    console.log(client);
    // this.server.emit('Notification', { data: "abcd" });
    client.emit('Notification', { data: "abcd" });
    return { data: "abcd" };
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
    await this.cacheManager.set(client.id, data.userId);
    console.log(await this.cacheManager.get(client.id));
    this.sendNotification("abc", "def");
    client.emit('Notification', { data: "Subscription Added" });
    return { data: "Subscription Added" };
  }

  async sendNotification(uuid, data) {

    console.log("function called")
    // connectedSocket = clientID,client
    // redis = clientid, userId
    for (let i = 0; i < this.connectedSockets.length; i++) {
      console.log("in loop");
      const userID = await this.cacheManager.get(this.connectedSockets[i].clientId);
      console.log(userID)
      console.log("uuid ->"+ uuid);
      console.log(data.dataValues);
      if (uuid !== userID) {
        console.log("client info");
        console.log(this.connectedSockets[i].client);
        this.connectedSockets[i].client.emit('Notification', { payload: data.dataValues });
      }
    }
    return 1;
  }
}
