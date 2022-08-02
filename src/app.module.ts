import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mongoConnectURI } from './config/mongoCred.config';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtSec } from './config/jwt.config'
@Module({
  imports: [UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
