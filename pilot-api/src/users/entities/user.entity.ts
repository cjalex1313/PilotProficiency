import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum Role {
  Admin = 'Admin',
  Pilot = 'Pilot',
}

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({
    required: true,
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Please provide a valid email address',
    ],
  })
  email: string;
  @Prop({ required: true })
  passwordHash: string;
  @Prop({ default: false })
  emailConfirmed: boolean;
  @Prop()
  emailConfirmatioToken: string;
  @Prop({
    type: String,
    default: null,
    required: false,
  })
  passwordResetToken?: string | null;
  @Prop({
    // Validation to ensure the array is not empty
    validate: {
      validator: function (rolesArray) {
        // Check if it's an array and has at least one element
        return Array.isArray(rolesArray) && rolesArray.length > 0;
      },
      // Custom error message if the validation fails
      message: 'User must have at least one role assigned.',
    },
  })
  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
