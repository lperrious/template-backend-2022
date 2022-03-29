import { NextFunction, Request, Response } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { json } from 'body-parser';
import RequestWithRawBody from '../helpers/interfaces/requestWithRawBody.interface';

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  public use(req: Request, res: Response, next: NextFunction) {
    json({
      verify: (request: RequestWithRawBody, response, buffer) => {
        if (Buffer.isBuffer(buffer)) {
          const rawBody = Buffer.from(buffer);
          request.rawBody = rawBody;
        }

        return true;
      },
    })(req, res, next);
  }
}
