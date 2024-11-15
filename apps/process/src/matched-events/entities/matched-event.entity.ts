import { ObjectId } from 'mongodb';
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class MatchedEvent {
  @ObjectIdColumn()
  id?: ObjectId;

  @Column()
  eventId: ObjectId;

  @Column()
  ruleId: ObjectId;

  @Column()
  agentId: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
