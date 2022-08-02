import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { User, UserSchema } from './user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { mongoConnectURI } from '../config/mongoCred.config';

@Module({
  imports: [MongooseModule.forRoot(mongoConnectURI),MongooseModule.forFeature([{name: User.name,schema: UserSchema }]),AuthModule],
  controllers:[UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {
}
