import {
  Entity,
  ObjectId,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectIdColumn,
} from 'typeorm';

@Entity()
export class Rule {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({ type: String })
  description!: string;

  @Column({ type: Boolean, default: true })
  isActive: boolean = true;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
