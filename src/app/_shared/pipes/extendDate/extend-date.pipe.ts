import { Pipe, PipeTransform, LOCALE_ID, Inject } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'date',
})
export class ExtendDatePipe extends DatePipe implements PipeTransform {
  readonly customFormats = {
    ium: 'xxx',
    short: 'xxx',
  };
  constructor(
    @Inject(LOCALE_ID) locale: string,
  ) {
    super(locale);
  }
  transform(
    value: any,
    format = 'mediumDate',
    timezone?: string,
    locale?: string
  ): string {
    format = this.customFormats[format] || format;
    // timezone =
    //   this.appService &&
    //   this.appService.dashboardConfigs &&
    //   this.appService.dashboardConfigs.timezone
    //     ? this.appService.dashboardConfigs.timezone
    //     : 'UTC +530';
    return super.transform(value, format, timezone, locale);
  }
}
