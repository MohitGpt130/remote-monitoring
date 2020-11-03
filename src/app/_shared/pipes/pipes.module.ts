import { DurationToTime } from './duration2time/duration2time.pipe';
import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe, CurrencyPipe, PercentPipe, DatePipe } from '@angular/common';
import { NgPipesModule } from 'ngx-pipes';


import { PaginationPipe} from './pagination/pagination.pipe';
import { ProfilePicturePipe } from './profilePicture/profilePicture.pipe';
import { TruncatePipe } from './truncate/truncate.pipe';
import { MailSearchPipe } from './search/mail-search.pipe';
import { DynamicPipe } from './dynamic/dynamic-pipe.pipe';
import { EvaluatePipe } from './evaluate/evaluate.pipe';
import { ExtendDatePipe } from './extendDate/extend-date.pipe';

@NgModule({
    imports: [
        CommonModule,
        NgPipesModule,
    ],
    declarations: [
        PaginationPipe,
        ProfilePicturePipe,
        TruncatePipe,
        MailSearchPipe,
        DurationToTime,
        DynamicPipe,
        EvaluatePipe,
        ExtendDatePipe,
    ],
    exports: [
        DecimalPipe,
        CurrencyPipe,
        PercentPipe,
        DatePipe,

        PaginationPipe,
        ProfilePicturePipe,
        TruncatePipe,
        MailSearchPipe,
        DurationToTime,
        DynamicPipe,
        EvaluatePipe,
        ExtendDatePipe,
        NgPipesModule,
    ],
    providers: [
      DecimalPipe,
      CurrencyPipe,
      PercentPipe,
      DatePipe,

      PaginationPipe,
      ProfilePicturePipe,
      TruncatePipe,
      MailSearchPipe,
      DurationToTime,
      DynamicPipe,
      EvaluatePipe,
      ExtendDatePipe,
      NgPipesModule,
    ]
})
export class PipesModule { }
