/**
 * SkincarePillar Entity
 * 7 categorical pillars organizing skincare knowledge
 */

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { SkincareAtom } from './skincare-atom.entity';

@Entity({ schema: 'jade', name: 'skincare_pillars' })
export class SkincarePillar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'integer', unique: true })
  number: number; // 1-7

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'icon_url', type: 'varchar', length: 500, nullable: true })
  iconUrl: string | null;

  @Column({ name: 'hex_color', type: 'varchar', length: 7, nullable: true })
  hexColor: string | null;

  @Column({ name: 'display_order', type: 'integer', default: 0 })
  displayOrder: number;

  @OneToMany(() => SkincareAtom, (atom) => atom.pillar)
  atoms: SkincareAtom[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
