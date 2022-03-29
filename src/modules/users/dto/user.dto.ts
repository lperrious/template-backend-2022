import { Args, ObjectType, Field, ID } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';
@ObjectType()
export class UserDTO {
  @Field(() => ID)
  id(@Args("_id") _id: MongooseSchema.Types.ObjectId): string {
    return _id.toString();
  }
  @Field()
  name: string;
  @Field()
  email: string;
  @Field({nullable: true})
  age?: number;
}