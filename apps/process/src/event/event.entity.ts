import {
  Entity,
  ObjectId,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectIdColumn,
  BeforeInsert,
  BeforeUpdate,
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
