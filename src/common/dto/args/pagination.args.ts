import { Field } from "@nestjs/graphql";
import { IsInt, IsOptional, Min } from "class-validator";

export class PaginationArgs {

  @Field(() => Number, { defaultValue: 0, description: "Number of items to skip" })
  @IsInt()
  @Min(0)
  @IsOptional()
  offset?: number = 0;

  @Field(() => Number, { defaultValue: 10, description: "Maximum number of items to return" })
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;
}