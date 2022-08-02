import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtSec } from 'src/config/jwt.config';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.stratery';

@Module({
  imports:[JwtModule.register({secret: jwtSec,signOptions: { expiresIn: '120s' },})],
  providers: [AuthService,JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
