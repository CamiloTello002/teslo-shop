import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
	@IsNumber()
	@IsPositive()
	@Type(() => Number) // this is TRANSFORMING our incoming data
	@IsOptional()
	limit?: number;

	@IsNumber()
	@Min(0)
	@Type(() => Number) // this is TRANSFORMING our incoming data
	@IsOptional()
	offset?: number;
}
