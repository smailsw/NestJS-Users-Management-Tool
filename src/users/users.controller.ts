import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUserEmailFromRequest } from 'src/utils/get-user-email-from-request-decorator';
import { UserInterface } from './UserInterface.model';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService){}

    //LOGIN USER
    @Post('login')
    async loginUser(@Body() userObject: UserInterface){
        return await this.userService.loginUser(userObject);
    }

    //NEW USER TO DB
    @Post('new')
    async addUser(@Body() userObject: UserInterface){
        return await this.userService.insertUser(userObject);
    }

    //GET ALL USERS FROM DB
    @Get('all')
    async asyncgetUsersList(){
        return await this.userService.getAllUsers();
    }

    //FIND USER BY EMAIL
    @Get(':email')
    async getUserbyEmail(@Param('email') email: string){
        return await this.userService.getUser(email);
    }

    //CHANGE PASSWORD USING EMAIL
    @UseGuards(AuthGuard('myJWT'))
    @Patch(':email')
    async updateUserPass(@GetUserEmailFromRequest() userEmail: string,@Body('password') newPassword: string,@Param('email') email: string){
        return await this.userService.changePassword(userEmail,email,newPassword);
    }

    //DELETE USER BY EMAIL
    @Delete(':email')
    async deleteUser(@Param('email') email: string){
        return await this.userService.deleteUSer(email);
    }
}
