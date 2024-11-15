import {
  Entity,
  ObjectId,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectIdColumn,
} from 'typeorm';

@Entity()
export class Event {
  @ObjectIdColumn()
  id?: ObjectId;

  @Column({ type: String })
  name: string;

  @Column({ type: String })
  value: string;

  @Column({ type: String })
  agentId: string;

  @CreateDateColumn({ default: new Date() }) // TODO
  createdAt?: Date;

  @UpdateDateColumn({ default: new Date() })
  updatedAt?: Date;
}
