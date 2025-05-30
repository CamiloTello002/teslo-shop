import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity({ name: 'product_images' })
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  url: string;

  @ManyToOne(
    () => Product,
    (product) => product.images,
    { onDelete: 'CASCADE' } // if the referenced entity is deleted, delete this entity
  )
  product: Product;
}
