import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserInterface } from 'src/users/UserInterface.model';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService){}

    signInUser(userId: string, email: string, role: number){
        try{
            return this.jwtService.sign({
                sub: userId,
                email: email,
                role: role
            })
        }catch(err){
            throw new HttpException(err.message,500);
        }
    }
}
