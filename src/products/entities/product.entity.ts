import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true, // two products CAN'T have the same name
  })
  title: string;

  @Column('integer', {
    default: 0
  })
  price: number;

  @Column({
    type: 'text',
    nullable: true
  })
  description: string;

  @Column({
    type: 'text',
    unique: true
  })
  slug: string;

  @Column({
    type: 'integer',
    default: 0
  })
  stock: number;

  @Column('text', {
    array: true
  })
  sizes: string[]

  @Column('string')
  gender: string;
}
