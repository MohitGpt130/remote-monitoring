import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'duration2Time' })
export class DurationToTime implements PipeTransform {
  transform(seconds: number, format: string): string {
    // tslint:disable-next-line: radix
    seconds = parseInt(Number(seconds).toString());
    const h = Math.floor(seconds / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = Math.floor(seconds % 3600 % 60);

    const hDisplay = h > 0 ? (h < 10 ? '0' : '') + h + '' : '00';
    const mDisplay = m > 0 ? (m < 10 ? '0' : '') + m + '' : '00';
    const sDisplay = s > 0 ? (s < 10 ? '0' : '') + s : '00';

    if (format !== undefined) {
      if (format === 'HH:MM') {
        return hDisplay + 'h:' + mDisplay + 'm';
      }
      else if (format === 'HH') {
        return hDisplay + 'h';
      }
      else if (format === 'HH:MM:SS') {
        return hDisplay + 'h:' + mDisplay + 'm:' + sDisplay + 's';
      } else if (format === '::') {
        return hDisplay + ':' + mDisplay + ':' + sDisplay + '';
      }
    } else {
      return hDisplay + 'h:' + mDisplay + 'm:' + sDisplay + 's';
    }
  }
}
