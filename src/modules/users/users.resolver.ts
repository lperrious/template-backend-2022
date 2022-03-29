import { Args, Mutation, Resolver, Query } from "@nestjs/graphql";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";
import { UserDTO } from "./dto/user.dto";
import { User } from "./schemas/user.schema";

@Resolver(() => UserDTO)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Mutation(() => UserDTO)
  async createUser(
    @Args("createUserDto") createUserDto: CreateUserDto
  ): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Query(() => [UserDTO])
  async users() {
    return this.usersService.findAll();
  }

  @Query(() => UserDTO)
  async user(
    @Args('id') id: string,
  ) {
    return this.usersService.findById(id);
  }
}
