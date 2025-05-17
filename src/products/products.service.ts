import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { validate as isUUID } from 'uuid'
import { ProductImage } from './entities/product-image.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource
  ) { }


  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productDetails } = createProductDto;
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map((image) => this.productImageRepository.create({ url: image }))
      });
      await this.productRepository.save(product);
      return { ...product, images };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      const allProducts = await this.productRepository.find({
        skip: offset,
        take: limit,
        order: {
          'title': 'asc'
        },
        relations: {
          images: true
        }
      });
      return allProducts.map(product => ({
        ...product,
        images: product.images?.map((image) => image.url)
      }));
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(term: string) {
    let product: Product | null = null;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term })
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('product');
      product = await queryBuilder.where('UPPER(title) =:title or slug =:slug', {
        title: term.toUpperCase(),
        slug: term.toLowerCase()
      }).leftJoinAndSelect('product.images', 'productImages').getOne()
    }

    if (!product) {
      throw new NotFoundException(`Product with id ${term} wasn't found`)
    }
    return product;
  }

  async findOnePlain(term: string) {
    const { images = [], ...productDetails } = await this.findOne(term);
    return {
      ...productDetails,
      images: images.map(image => image.url)
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, ...toUpdate } = updateProductDto;
    const product = await this.productRepository.preload({ id: id, ...toUpdate })
    if (!product) throw new NotFoundException(`Product with id: ${id} not found`);

    // create query runner
    const queryRunner = this.dataSource.createQueryRunner()

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      if (images) {
        await queryRunner.manager.delete(ProductImage, {
          product: { id }
        });
        product.images = images.map(image => this.productImageRepository.create({ url: image }))
      }
      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();

      return this.findOnePlain(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleDBExceptions(error)
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string) {
    try {
      const product = await this.findOne(id);
      await this.productRepository.remove(product);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');
    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail)
    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error. Check server logs')
  }
}
