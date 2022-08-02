import { HttpCode, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserInterface } from './UserInterface.model';
import { User,UserSchema } from './user.schema';
import * as bcrypt from 'bcrypt';
import { hashSalt } from 'src/config/mongoCred.config';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from '@nestjs/passport';


@Injectable()
export class UsersService {

    constructor(@InjectModel(User.name) private userModel: Model<UserInterface>, private authService: AuthService){}

    // @POST /users/login
    // Desc login user using credentials email and password

    async loginUser(userObject: UserInterface) {
        try{
            //check if values exist
            if(!userObject.email || !userObject.password) throw new UnauthorizedException();
            //check if user exists
            const userIfExists=await this.userModel.findOne({'email':userObject.email}).exec();
            if(!userIfExists) throw new UnauthorizedException();
            
            //compare the password then send the result
            const passordMatch = await bcrypt.compare(userObject.password,userIfExists.password);
            if(!passordMatch) throw new UnauthorizedException();
            console.log(userIfExists.id)
            
            //get JWT Token based on user info
            return {token: this.authService.signInUser(userIfExists.id,userIfExists.email,userIfExists.role), userData: {email: userIfExists.email,role: userIfExists.role} };

        }catch(err){
            console.log(err)
            throw new HttpException(err.message,err.status); 
        }
    }

    // @POST /users/new
    // Desc insert new user to the database

    async insertUser(user: UserInterface): Promise<User>{
        try{
            //check if user exists
            const userIfExists=await this.userModel.findOne({'email':user.email}).exec();
            if(userIfExists) throw new HttpException('User Already Exist',409);

            //check password length before hashing
            if(user.password.length<8) throw new HttpException('Password should be minimum 8 characters',500);

            //hash password then save the user to the DB
            user.password = await bcrypt.hash(user.password, hashSalt);
            const createdUser= new this.userModel(user);
            return await createdUser.save();
        }catch(err){
            throw new HttpException(err.message,err.status); 
        }
    }

    // @GET /users/all
    // Desc get all users in database

    async getAllUsers(): Promise<User[]>{
        try{
            const usersList:UserInterface[] = await this.userModel.find().exec();
            return usersList.map((user)=>(
                {
                    id:user.id,
                    email:user.email,
                    password:user.password,
                    role:user.role
                }
            ))
        }catch(err){
            throw new HttpException(err.message,err.status); 
        }
    }

    // @GET /users/{email}
    // Desc get specific user by email

    async getUser(email: string){
        try{
            const user=await this.userModel.findOne({'email':email}).exec();
            if(!user) throw new NotFoundException('User Not found');
            return user;
        }catch(err){
            throw new HttpException(err.message,err.status); 
        }
    }

    // @PATCH /users/{email}
    // Body password:{new password}
    // Desc change password for specified email user

    async changePassword(emailFromToken: string, email: string,newPassword: string): Promise<any>{
        try{
            console.log(emailFromToken)
            if(newPassword=='' || newPassword==null) throw new HttpException('Password cannot be empty',500);
            if(emailFromToken!=email) throw new UnauthorizedException();
            if(newPassword.length<8) throw new HttpException('Password must be at least 8 characters long',500);
            const newPassHashed = await bcrypt.hash(newPassword, hashSalt);
            const user = await this.userModel.updateOne({'email':email},{password:newPassHashed})
            if(!user || user.matchedCount==0 || user.modifiedCount==0) throw new HttpException('Error while changing the password',500);
            if(user.acknowledged) return {message: 'Password has been changed'};
        }catch(err){
            throw new HttpException(err.message,err.status); 
        }
    }

    // @DELETE /users/{email}
    // Desc delete user by the specified email user

    async deleteUSer(email: string): Promise<any>{
        try{
            const user = await this.userModel.findOne({'email':email}).exec();
            if(!user) throw new NotFoundException('User Not found');
            await user.delete();
            return {message: 'the User '+email+' has been deleted from the database'};
        }catch(err){
            throw new HttpException(err.message,err.status); 
        }
    }
}
