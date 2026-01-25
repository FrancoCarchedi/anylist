import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

@InputType()
export class SignUpInput {

  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  fullName: string;

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