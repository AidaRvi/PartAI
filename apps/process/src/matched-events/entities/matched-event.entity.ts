import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectId,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class MatchedEvent {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  eventId: ObjectId;

  @Column()
  ruleId: ObjectId;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
