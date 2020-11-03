import { DurationToTime } from '../duration2time/duration2time.pipe';
import { Pipe, PipeTransform, Injector } from '@angular/core';
import { PercentPipe, CurrencyPipe, DecimalPipe, DatePipe } from '@angular/common';

@Pipe({
  name: 'dynamicPipe',
})
export class DynamicPipe implements PipeTransform {
  public constructor(
    private injector: Injector,
  ) {}
  transform(value: any, pipeToken: any, pipeArgs: any[]): any {
    const MAP = {
      currency: CurrencyPipe,
      decimal: DecimalPipe,
      percent: PercentPipe,
      date: DatePipe,
      duration2Time: DurationToTime,
    };
    if (pipeToken && MAP.hasOwnProperty(pipeToken)) {
      const pipeClass = MAP[pipeToken];
      const pipe = this.injector.get(pipeClass);
      if (Array.isArray(pipeArgs)) {
        return pipe.transform(value, ...pipeArgs);
      } else {
        return pipe.transform(value, pipeArgs);
      }
    } else {
      return value;
    }
    return value;
  }
}
