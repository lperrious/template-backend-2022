import { NextFunction, Request, Response } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { json } from 'body-parser';

@Injectable()
export class JsonBodyMiddleware implements NestMiddleware {
  public use(req: Request, res: Response, next: NextFunction) {
    json()(req, res, next);
  }
}
