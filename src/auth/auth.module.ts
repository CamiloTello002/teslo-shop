import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController], // for handling http operations
  providers: [AuthService], // business logic for authentication
  // user entity for database operations. Mostly used within
  // auth service
  imports: [
    TypeOrmModule.forFeature([
      User,
    ]),
    // use passport for authentication strategy
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // configures jwt secret and expiration time
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '1h'
        }
      })
    })
  ],
})
export class AuthModule { }
