import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany, JoinTable } from 'typeorm';
import { CreateProductDTO } from './dto/createproduct.dto';
import { UpdateProductDTO } from './dto/updateproduct.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ItemCart } from '../cart/itemcart.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;
  

  @Column()
  @ApiProperty()
  code: string;

  @Column()
  @ApiProperty()
  description: string;

  @Column()
  @ApiProperty()
  price: number;

  @Column()
  @ApiProperty()
  category: string;

  @OneToMany(type => ItemCart, itemCart => itemCart.cart)
  @JoinTable()
  itemCart: ItemCart[]

  static newProductByCreate(createProductDto: CreateProductDTO) {
    let product = new Product()
    product.code = createProductDto.code
    product.category = createProductDto.category
    product.description = createProductDto.description
    product.price = createProductDto.price
    return product
  }

  static newProductByUpdate(id: string, updateProductDto: UpdateProductDTO) {
    let product = new Product()
    product.id = +id
    product.code = updateProductDto.code
    product.category = updateProductDto.category
    product.price = updateProductDto.price
    product.description = updateProductDto.description
    return product
  }
}