import { Pipe, PipeTransform } from '@angular/core';
import * as math from 'mathjs';

@Pipe({ name: 'evaluate' })
export class EvaluatePipe implements PipeTransform {
  transform(input: string): string {
    // return new Parser().parse(input).evaluate();
    return math.parser().evaluate(input);
    // return input;
  }
}
