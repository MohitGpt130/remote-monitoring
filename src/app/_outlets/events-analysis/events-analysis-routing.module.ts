import { DashboardComponent } from './dashboard/dashboard.component';
import { ShiftSummaryDataComponent } from './shift-summary-data/shift-summary-data.component';
import { OeeSummaryChartComponent } from './oee-summary-chart/oee-summary-chart.component';
import { EventsTimelineChartComponent } from './events-timeline-chart/events-timeline-chart.component';
import { EventsSummaryChartsComponent } from './events-summary-charts/events-summary-charts.component';
import { AnalysedSummaryDataComponent } from './analysed-summary-data/analysed-summary-data.component';
import { EventsAnalysisComponent } from './events-analysis.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: ':lineID',
    component: EventsAnalysisComponent,
    pathMatch: 'full',
  },
  {
    path: '',
    component: EventsAnalysisComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard/line1',
        pathMatch: 'full',
      },
      {
        path: 'dashboard/:lineID',
        component: DashboardComponent,
        pathMatch: 'full',
      },
      {
        path: 'analysed-summary-data/:lineID',
        component: AnalysedSummaryDataComponent,
        pathMatch: 'full',
      },
      {
        path: 'events-summary-charts',
        component: EventsSummaryChartsComponent,
        pathMatch: 'full',
      },
      {
        path: 'events-timeline-chart',
        component: EventsTimelineChartComponent,
        pathMatch: 'full',
      },
      {
        path: 'oee-summary-chart',
        component: OeeSummaryChartComponent,
        pathMatch: 'full',
      },
      {
        path: 'shift-summary-data',
        component: ShiftSummaryDataComponent,
        pathMatch: 'full',
      },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsAnalysisRoutingModule { }
