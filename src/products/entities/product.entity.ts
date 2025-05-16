import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column('text')
  gender: string;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }
    // this will CHECK the slug field. It can come from either
    // the one provided by the user or the title
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '')
  }
}
