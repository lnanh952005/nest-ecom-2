import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class QueryValidationPipe implements PipeTransform {
  constructor(private validate: ZodSchema) {}
  transform(value: any, metadata: ArgumentMetadata) {
    return metadata.type == 'query' ? this.validate.parse(value) : value;
  }
}
