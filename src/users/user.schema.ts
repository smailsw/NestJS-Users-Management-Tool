import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { type } from 'os';

@Schema({
    validateBeforeSave: true,
  })
export class User {

  @Prop({
    required: [true, 'Email field must be defined'],
    unique:true,
    match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    
  })
  email: string;

  @Prop({
    required: [true, 'Password should be minimum 8 characters'],
    minlength: 8,
  })
  password: string;

  @Prop({
    default:0
  })
  role: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
