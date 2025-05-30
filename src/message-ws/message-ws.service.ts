import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

interface ConnectedClients {
  [id: string]: {
    socket: Socket,
    user: User
  }
}

@Injectable()
export class MessageWsService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  private connectedClients: ConnectedClients = {}

  async registerClient(client: Socket, userId: string) {
    // we need to verify the client
    const user = await this.userRepository.findOneBy({ id: userId })

    if (!user) throw new Error('User not found')

    if (!user.isActive) throw new Error('User not found')

    this.checkUserConnection(user);

    this.connectedClients[client.id] = {
      socket: client,
      user
    };
  }

  removeClient(clientId: string) {
    delete this.connectedClients[clientId];
  }

  getConnectedClients() {
    return Object.keys(this.connectedClients);
  }

  getUserFullNameBySocketId(socketId: string) {
    return this.connectedClients[socketId].user.fullName;
  }

  private checkUserConnection(user: User) {

    for (const clientId of Object.keys(this.connectedClients)) {

      const connectedClient = this.connectedClients[clientId];

      if (connectedClient.user.id === user.id) {
        connectedClient.socket.disconnect();
        break;
      }

    }
  }

}
