import { Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Server } from 'ws';
import { Socket } from 'socket.io';

@WebSocketGateway()

export class AppGateway implements OnGatewayInit, OnGatewayConnection {

  @WebSocketServer()
  server: Server;

  public connectedSockets: { [key: string]: any[] } = {};
  
  handleConnection(client: Socket, ...args: any[]) {
    console.log(client.data);
    return { event: 'Notification', data: "payload" };
    //user request notification usko redis 
  }
  private logger: Logger = new Logger('AppGateway');
  afterInit(server: any) {
    this.logger.log("started");
  }
  @SubscribeMessage('Notification')
  handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket, payload: any) {
    console.log(this.connectedSockets);
    console.log(this.server);
    client.emit('Notification', {data:"abcd"});
    return data;
    // console.log(client);
    // return { event: 'Notification', data: "payload" };
  }
  // handleMessage(@MessageBody() data: string): string {
  //   console.log(data);
  //   return data;
  // }
}
