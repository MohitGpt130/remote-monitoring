import { SfwModulesModule } from './../../_modules/sfw-modules/sfw-modules.module';
import { SharedModule } from './../../_shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsAnalysisRoutingModule } from './events-analysis-routing.module';
import { EventsAnalysisComponent } from './events-analysis.component';
import { AnalysedSummaryDataComponent } from './analysed-summary-data/analysed-summary-data.component';
import { EventsSummaryChartsComponent } from './events-summary-charts/events-summary-charts.component';
import { EventsTimelineChartComponent } from './events-timeline-chart/events-timeline-chart.component';
import { OeeSummaryChartComponent } from './oee-summary-chart/oee-summary-chart.component';
import { ShiftSummaryDataComponent } from './shift-summary-data/shift-summary-data.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EventCausesDataTableComponent } from './event-causes-data-table/event-causes-data-table.component';


@NgModule({
  declarations: [EventsAnalysisComponent, AnalysedSummaryDataComponent, EventsSummaryChartsComponent, EventsTimelineChartComponent, OeeSummaryChartComponent, ShiftSummaryDataComponent, DashboardComponent, EventCausesDataTableComponent],
  imports: [
    CommonModule,
    EventsAnalysisRoutingModule,

    SfwModulesModule,
    SharedModule,
  ],
  exports: [
    SfwModulesModule,
    SharedModule,
  ]
})
export class EventsAnalysisModule { }
