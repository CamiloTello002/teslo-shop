import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Server, Socket } from 'socket.io';
import { Events } from './enums/events.enum';

@WebSocketGateway({ cors: true })
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() webSocketServer: Server;

  constructor(private readonly messageWsService: MessageWsService) { }

  handleConnection(client: Socket) {

    this.messageWsService.registerClient(client);

    console.log('Connected clients: ', this.messageWsService.getConnectedClients())

    this.webSocketServer.emit(Events.ClientsUpdated, this.messageWsService.getConnectedClients())

  }

  handleDisconnect(client: Socket) {

    this.messageWsService.removeClient(client.id);

    console.log('Connected clients: ', this.messageWsService.getConnectedClients())

    this.webSocketServer.emit(Events.ClientsUpdated, this.messageWsService.getConnectedClients())
  }
}
