import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtSec } from 'src/config/jwt.config';

//passport to protect the Signin
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'myJWT') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //true for DEV only
      ignoreExpiration: false,
      secretOrKey: jwtSec,
    });
  }

  async validate(payload: any) {
    return payload;
  }
}