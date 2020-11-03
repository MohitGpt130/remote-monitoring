import { SharedModule } from './../../_shared/shared.module';
import { ScrollingDataDivComponent } from './scrolling-data-div/scrolling-data-div.component';
import { EmbeddedDivComponent } from './embedded-div/embedded-div.component';
import { DataGridComponent } from './data-grid/data-grid.component';
import { DataTableComponent } from './data-table/data-table.component';
import { PipeDivComponent } from './pipe-div/pipe-div.component';
import { CalculationDivComponent } from './calculation-div/calculation-div.component';
import { ThresholdDivComponent } from './threshold-div/threshold-div.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SfwModulesRoutingModule } from './sfw-modules-routing.module';
import { SfwHeaderComponent } from './sfw-header/sfw-header.component';


@NgModule({
  declarations: [
    ThresholdDivComponent, CalculationDivComponent, PipeDivComponent, DataTableComponent, DataGridComponent, EmbeddedDivComponent, ScrollingDataDivComponent, SfwHeaderComponent,
  ],
  imports: [
    CommonModule,
    SfwModulesRoutingModule,
    SharedModule,
  ],
  exports: [
    ThresholdDivComponent, CalculationDivComponent, PipeDivComponent, DataTableComponent, DataGridComponent, EmbeddedDivComponent, ScrollingDataDivComponent, SfwHeaderComponent,
    SharedModule,
  ]
})
export class SfwModulesModule { }
