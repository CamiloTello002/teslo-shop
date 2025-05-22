import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly messageWsService: MessageWsService) { }

  handleConnection(client: Socket) {
    console.log('\n=== New WebSocket Connection ===');

    // Basic Info
    console.log('🔌 Connection Details:');
    console.log(`  Socket ID: ${client.id}`);
    console.log(`  Connected at: ${new Date(client.handshake.time).toISOString()}`);
    console.log(`  IP Address: ${client.handshake.address}`);

    // Transport Info
    console.log('🚀 Transport:');
    console.log(`  Type: ${client.conn.transport?.name || 'unknown'}`);
    console.log(`  Upgraded: ${client.conn.upgraded}`);
    console.log(`  Protocol: ${client.conn.protocol}`);

    // Client Info
    console.log('🌐 Client Details:');
    console.log(`  User Agent: ${client.handshake.headers['user-agent']}`);
    console.log(`  Origin: ${client.handshake.headers.origin}`);
    console.log(`  Language: ${client.handshake.headers['accept-language']}`);

    // Authentication & Query
    if (Object.keys(client.handshake.auth).length > 0) {
      console.log('🔐 Auth Data:', client.handshake.auth);
    }

    if (Object.keys(client.handshake.query).length > 0) {
      console.log('❓ Query Params:', client.handshake.query);
    }

    // Rooms
    console.log('🏠 Rooms:', Array.from(client.rooms));

    console.log('================================\n');
  }

  handleDisconnect(client: any) {
    console.log(`❌ Client disconnected: ${client.id}`);
  }
}
