import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export enum SessionStatus {
  PLANNED = 0,
  COMPLETED = 1,
}

// Define the structure for the skill performance sub-document
@Schema({ _id: false }) // _id: false prevents Mongoose from creating an _id for subdocuments
export class SessionSkill {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill', // Reference to the Skill entity
    required: true,
  })
  skillId: Types.ObjectId; // Changed from skillId to follow convention, but you can keep skillId if preferred

  @Prop({
    type: Number,
    required: true,
    min: 1, // Ensure trials are not negative
    default: 1,
  })
  numberOfTrials: number;
}

export const SessionSkillSchema = SchemaFactory.createForClass(SessionSkill);

export type SessionDocument = HydratedDocument<Session>;

@Schema({ timestamps: true })
export class Session {
  _id: Types.ObjectId;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  userId: Types.ObjectId;
  @Prop({
    type: String,
    required: false,
    trim: true,
  })
  name?: string | null;
  @Prop({
    required: true,
  })
  date: Date;
  @Prop({
    type: Number,
    required: false,
  })
  durationMinutes?: number | null;
  @Prop({
    type: String,
    required: false,
  })
  notes?: string | null;
  @Prop({
    required: true,
    type: Number, // Store as a Number in MongoDB
    enum: Object.values(SessionStatus).filter((v) => typeof v === 'number'), // Use numeric enum values for validation
  })
  status: SessionStatus;
  @Prop({
    type: [SessionSkillSchema], // Use the schema defined above
    required: false, // Make it optional if a session might not have skills
    default: [], // Default to an empty array
  })
  skills?: SessionSkill[];
}

export const SessionSchema = SchemaFactory.createForClass(Session);
