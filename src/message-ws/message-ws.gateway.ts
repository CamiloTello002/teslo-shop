import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Server, Socket } from 'socket.io';
import { Events } from './enums/events.enum';
import { NewMessageDto } from './dto/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@WebSocketGateway({ cors: true })
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() webSocketServer: Server;

  constructor(
    private readonly messageWsService: MessageWsService,
    private readonly jwtService: JwtService,
  ) { }

  async handleConnection(client: Socket) {

    const token = client.handshake.headers['authentication'] as string;

    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
      await this.messageWsService.registerClient(client, payload.id);
    } catch (error) {

      client.disconnect();

      return;
    }


    console.log('Connected clients: ', this.messageWsService.getConnectedClients())

    this.webSocketServer.emit(Events.ClientsUpdated, this.messageWsService.getConnectedClients())

  }

  handleDisconnect(client: Socket) {

    this.messageWsService.removeClient(client.id);

    console.log('Connected clients: ', this.messageWsService.getConnectedClients())

    this.webSocketServer.emit(Events.ClientsUpdated, this.messageWsService.getConnectedClients())
  }

  @SubscribeMessage(Events.MessageFromClient)
  onMessageFromClient(client: Socket, payload: NewMessageDto) {

    // Emit to a single client
    //client.emit(Events.MessageFromServer, {
    //  fullName: 'Pepito Pérez',
    //  message: payload.message || 'no message!!'
    //});

    // Emit to all clients except the client who sent the message
    //client.broadcast.emit(Events.MessageFromServer, {
    //  userId: client.id,
    //  message: payload.message || 'no message!!'
    //});

    // Emit to all clients including the client who sent the message
    this.webSocketServer.emit(Events.MessageFromServer, {
      //userId: client.id,
      userId: this.messageWsService.getUserFullNameBySocketId(client.id),
      message: payload.message || 'no message!!'
    });
  }
}
