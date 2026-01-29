import { Field } from "@nestjs/graphql";
import { IsOptional, IsString } from "class-validator";

export class SearchArgs {

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  search?: string;
}