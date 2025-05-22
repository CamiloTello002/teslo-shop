import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {
  @ApiProperty({
    description: "Product's title",
    example: "Oversized jumper",
    nullable: false,
    uniqueItems: true,
    minLength: 1
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({
    description: "Product's price",
    example: 400,
    nullable: true,
    default: 0,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: "Product's description",
    example: "A beautiful jumper you can use on winter",
    nullable: true,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "Product's slug for SEO. The API will generate it for you in case you don't provide it",
    example: "oversized_jumper",
    nullable: true,
    required: false
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @ApiProperty()
  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @ApiProperty()
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags: string[];

  @ApiProperty()
  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;

  @ApiProperty()
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
