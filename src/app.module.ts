import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { MiddlewareConsumer, Module, RequestMethod, ValidationPipe } from "@nestjs/common";
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { RouteInfo } from '@nestjs/common/interfaces';
import { DirectiveLocation, GraphQLDirective } from "graphql";
import { upperDirectiveTransformer } from "./common/directives/upper-case.directive";
import { UsersModule } from "./modules/users/users.module";
import { LoggerModule } from '@/modules/logger/logger.module';
import { LoggerMiddleware } from '@/modules/logger/logger.middleware';
import { MongoErrorFilter } from '@/exception/mongoError.filter';

import { MongooseModule } from "@nestjs/mongoose";
import config from "./config/config";

import { RawBodyMiddleware } from '@/middlewares/rawBody.middleware';
import { JsonBodyMiddleware } from '@/middlewares/jsonBody.middleware';

// This is an array of routes we want raw body parsing to be available on
const rawBodyParsingRoutes: Array<RouteInfo> = [
  // {
  //   path: '/stripe/webhook',
  //   method: RequestMethod.POST,
  // },
];

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: "src/schema.gql",
      sortSchema: true,
      transformSchema: (schema) => upperDirectiveTransformer(schema, "upper"),
      installSubscriptionHandlers: true,
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: "upper",
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
    }),
    MongooseModule.forRoot(config().database.mongodb.host),
    UsersModule,
    LoggerModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe(),
    },
    {
      provide: APP_FILTER,
      useClass: MongoErrorFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL })
      .apply(RawBodyMiddleware)
      .forRoutes(...rawBodyParsingRoutes)
      .apply(JsonBodyMiddleware)
      .exclude(...rawBodyParsingRoutes)
      .forRoutes('*');
  }
}
