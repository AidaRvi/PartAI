import { ObjectId } from 'mongodb';
import {
  BeforeInsert,
  BeforeUpdate,
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

  @BeforeInsert()
  setCreationDate(): void {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  updateDate(): void {
    this.updatedAt = new Date();
  }
}
