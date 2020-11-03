import { DurationToTime } from './duration2time/duration2time.pipe';
import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe, PercentPipe, DatePipe, CurrencyPipe } from '@angular/common';

import { PaginationPipe} from './pagination/pagination.pipe';
import { ProfilePicturePipe } from './profilePicture/profilePicture.pipe';
import { ChatPersonSearchPipe } from './search/chat-person-search.pipe';
import { UserSearchPipe } from './search/user-search.pipe';
import { TruncatePipe } from './truncate/truncate.pipe';
import { MailSearchPipe } from './search/mail-search.pipe';
import { DynamicPipe } from './dynamic/dynamic-pipe.pipe';
import { EvaluatePipe } from './evaluate/evaluate.pipe';
import { ExtendDatePipe } from './extendDate/extend-date.pipe';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        PaginationPipe,
        ProfilePicturePipe,
        ChatPersonSearchPipe,
        UserSearchPipe,
        TruncatePipe,
        MailSearchPipe,
        DurationToTime,
        DynamicPipe,
        EvaluatePipe,
        ExtendDatePipe,
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
    ],
    exports: [
        PaginationPipe,
        ProfilePicturePipe,
        ChatPersonSearchPipe,
        UserSearchPipe,
        TruncatePipe,
        MailSearchPipe,
        DurationToTime,
        DynamicPipe,
        EvaluatePipe,
        ExtendDatePipe,

        DecimalPipe,
        PercentPipe,
        PercentPipe,
        DatePipe,
    ],
})
export class PipesModule { }
