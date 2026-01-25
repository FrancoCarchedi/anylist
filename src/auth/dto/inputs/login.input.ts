import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsStrongPassword } from "class-validator";

@InputType()
export class LoginInput {

  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}