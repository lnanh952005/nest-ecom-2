import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class QueryTransfromPipe implements PipeTransform {
  private parameter: string;
  constructor(parameter: string) {
    this.parameter = parameter;
  }
  transform(value: any, metadata: ArgumentMetadata) {
    return value[this.parameter] == this.parameter
      ? +value[this.parameter]
      : undefined;
  }
}
