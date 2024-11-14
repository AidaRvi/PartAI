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
  id: ObjectId;

  @Column({ type: String })
  name!: string;

  @Column({ type: String })
  value!: string;

  @Column({ type: String })
  agentId!: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
