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

  @Column({ type: Number })
  maxNameLength: number;

  @Column({ type: Number })
  minNameLength: number;

  @Column({ type: Number })
  valueLength: number;

  @Column({ type: Number })
  maxFirst3DigitSum: number;

  @Column({ type: Boolean, default: true })
  isActive: boolean = true;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
