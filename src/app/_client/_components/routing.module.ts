import { DashboardComponent } from './live-views/dashboard/dashboard.component';
import { CtestOverComponent } from './manualentry/ctest-over/ctest-over.component';
import { Manualentry1Component } from './manualentry/manualentry1/manualentry1.component';
import { Manualentry2Component } from './manualentry/manualentry2/manualentry2.component';
import { LiveViewsComponent } from './live-views/live-views.component';
import { MachineParametersChartsComponent } from './live-views/machine-parameters-charts/machine-parameters-charts.component';
import { MachineParametersTableComponent } from './live-views/machine-parameters-table/machine-parameters-table.component';
import { ChangeOverComponent } from './manualentry/change-over/change-over.component';
import { IntasComponent } from './intas.component';

import { TrailGridComponent } from './reports/trail-grid/trail-grid.component';
import { OperatorChartCompareComponent } from './reports/operator-chart-compare/operator-chart-compare.component';
import { BatchwiseReportComponent } from './reports/batchwise-report/batchwise-report.component';
import { Faultreport1Component } from './reports/faultreport1/faultreport1.component';
import { ScheduleComponent } from './schedule/schedule.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShiftendReportComponent } from './reports/shiftend-report/shiftend-report.component';
import { ManualentryComponent } from './manualentry/manualentry.component';
import { FaultcauseReportComponent } from './reports/faultcause-report/faultcause-report.component';
import { EventChartHistoryComponent } from './reports/event-chart-history/event-chart-history.component';

import { Screen1Component } from './tv-screen/screen1/screen1.component';
import { Screen2Component } from './tv-screen/screen2/screen2.component';
import { SwitchingComponent } from './tv-screen/switching/switching.component';
import { FaultListComponent } from './tv-screen/screen1/fault-list/fault-list.component';
import { Header1Component } from './tv-screen/screen1/header1/header1.component';
import { AgGridTrailReportComponent } from './reports/ag-grid-trail-report/ag-grid-trail-report.component';

const routes: Routes = [
  {
    path: '',
    component: IntasComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard/line1',
        pathMatch: 'full',
        data: {
          breadcrumb: 'Table-view',
        },
      },
      // { path: 'overview', component: Slide01Component },
      // { path: 'line', component: Slide02Component },
      // { path: 'trend', component: Slide04Component },
      { path: 'dashboard/:lineID', component: DashboardComponent },
      {
        path: 'lineview',
        component: LiveViewsComponent,
        children: [
          {
            path: '',
            redirectTo: 'lineview/table/count',
            pathMatch: 'full',
            data: {
              breadcrumb: 'Table-view',
            },
          },
          {
            path: 'table',
            component: MachineParametersTableComponent,
            children: [
              { path: '', redirectTo: 'count', pathMatch: 'full' },
              { path: 'count', component: MachineParametersTableComponent },
              { path: 'duration', component: MachineParametersTableComponent },
            ],
            data: {
              breadcrumb: 'Table-view',
            },
          },
          {
            path: 'charts',
            component: MachineParametersChartsComponent,
            data: {
              breadcrumb: 'Charts',
            },
          },
        ],
      },
      // { path: 'tv', component: SlidesComponent },
      {
        path: 'report/batch-wise',
        component: BatchwiseReportComponent,
        data: {
          breadcrumb: 'Batch-wise',
        },
      },
      {
        path: 'report/shift-end',
        component: ShiftendReportComponent,
        data: {
          breadcrumb: 'Shift-end',
        },
      },
      {
        path: 'report/fault-cause',
        component: FaultcauseReportComponent,
        data: {
          breadcrumb: 'Fault-cause',
        },
      },
      // {
      //   path: 'report/day-wise',
      //   component: DaywiseReportComponent,
      // },
      // {
      //   path: 'report/fault',
      //   component: FaultreportComponent,
      // },
      {
        path: 'report/fault-report',
        component: Faultreport1Component,
        data: {
          breadcrumb: 'Fault Report',
        },
      },
      {
        path: 'report/event-history',
        component: EventChartHistoryComponent,
        data: {
          breadcrumb: 'Event-History',
        },
      },
      {
        path: 'report/operator',
        component: OperatorChartCompareComponent,
        data: {
          breadcrumb: 'Operator Report',
        },
      },
      {
        path: 'report/ag-grid',
        component: AgGridTrailReportComponent,
        data: {
          breadcrumb: 'Intas',
        },
      },
      {
        path: 'report/test-grid',
        component: TrailGridComponent,
        data: {
          breadcrumb: 'Intas',
        },
      },

      {
        path: 'manual',
        component: ManualentryComponent,
        data: {
          breadcrumb: 'Intas',
        },
      },
      {
        path: 'plant-wise-entry',
        component: Manualentry1Component,
        data: {
          breadcrumb: 'Plant-wise-entry',
        },
      },
      {
        path: 'line-wise-entry',
        component: Manualentry2Component,
        data: {
          breadcrumb: 'Line-wise-entry',
        },
      },
      {
        path: 'schedule-entry',
        component: ScheduleComponent,
        data: {
          breadcrumb: 'Schedule Maintenance',
        },
      },
      {
        path: 'change-over',
        component: ChangeOverComponent,
        data: {
          breadcrumb: 'Changeover',
        },
      },
      {
        path: 'c-over',
        component: CtestOverComponent,
        data: {
          breadcrumb: 'Intas',
        },
      },
      {
        path: 'tv-screen1',
        component: Screen1Component,
        data: {
          breadcrumb: 'Intas',
        },
        pathMatch: 'full',
      },
      {
        path: 'tv-screen2',
        component: Screen2Component,
        data: {
          breadcrumb: 'Intas',
        },
        pathMatch: 'full',
      },
      {
        path: 'switch',
        component: SwitchingComponent,
        data: {
          breadcrumb: 'Intas',
        },
        pathMatch: 'full',
      },
      {
        path: 'screen1/fault',
        component: FaultListComponent,
        pathMatch: 'full',
      },
      {
        path: 'header1',
        component: Header1Component,
        data: {
          breadcrumb: 'Intas',
        },
        pathMatch: 'full',
      },
    ],
    data: {
      breadcrumb: 'Intas',
      roles: ['admin'],
      unauthorizedRoute: '/auth/un-authorized',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
