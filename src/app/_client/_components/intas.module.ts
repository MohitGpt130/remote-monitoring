import { EventCausesDataTableComponent } from './live-views/event-causes-data-table/event-causes-data-table.component';
import { SfwModulesModule } from './../../_modules/sfw-modules/sfw-modules.module';
import { EventsAnalysisService } from './live-views/events-analysis.service';
import { DashboardComponent } from './live-views/dashboard/dashboard.component';
import { ModuleService } from './module.service';
import { ConfirmDialogueComponent } from './manualentry/change-over/confirm-dialogue/confirm-dialogue.component';
import { ChangeOverComponent } from './manualentry/change-over/change-over.component';
import { CriticalMachineDataComponent } from './live-views/critical-machine-data/critical-machine-data.component';
import { StopVideoComponent } from './live-views/machine-parameters-charts/stop-video/stop-video.component';
import { StopInputFormComponent } from './live-views/machine-parameters-charts/stop-input-form/stop-input-form.component';
import { MachineParametersChartsComponent } from './live-views/machine-parameters-charts/machine-parameters-charts.component';
import { MachineParametersTableComponent } from './live-views/machine-parameters-table/machine-parameters-table.component';
import { CtestOverComponent } from './manualentry/ctest-over/ctest-over.component';
import { Manualentry2Component } from './manualentry/manualentry2/manualentry2.component';
import { Manualentry1Component } from './manualentry/manualentry1/manualentry1.component';
import {
  NgModule,
  Directive,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutingModule } from './routing.module';

import { WebDataRocksPivot } from './webdatarocks/webdatarocks.angular4';
import { CalendarHeaderComponent } from './schedule/demo-utils/calendar-header.component';
import { DemoComponent } from './schedule/demo/component';
import { ScheduleDialogComponent } from './schedule/schedule-dialog/schedule-dialog.component';
import { FaultnameComponent } from './manualentry/faultname/faultname.component';
import { ShiftformComponent } from './manualentry/shiftform/shiftform.component';
import { WeeklyoffformComponent } from './manualentry/weeklyoffform/weeklyoffform.component';
import { SkuformComponent } from './manualentry/skuform/skuform.component';
import { SchedulemaintainenceformComponent } from './manualentry/schedulemaintainenceform/schedulemaintainenceform.component';
import { ShiftbreakComponent } from './manualentry/shiftbreak/shiftbreak.component';
import { HolidaylistformComponent } from './manualentry/holidaylistform/holidaylistform.component';

import { IntasComponent } from './intas.component';

import { MatVideoModule } from 'mat-video';

import { ShiftEndFormComponent } from './live-views/machine-parameters-charts/shift-end-form/shift-end-form.component';
import { DatePipe } from '@angular/common';
import { ShiftendReportComponent } from './reports/shiftend-report/shiftend-report.component';
import { ShiftEmailDailogComponent } from './reports/shiftend-report/shift-email-dailog/shift-email-dailog.component';
import { ManualentryComponent } from './manualentry/manualentry.component';
import { FaultcauseformComponent } from './manualentry/faultcauseform/faultcauseform.component';
import { LineformComponent } from './manualentry/lineform/lineform.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { FaultcauseReportComponent } from './reports/faultcause-report/faultcause-report.component';
import { RejectQuantityFormComponent } from './live-views/machine-parameters-charts/reject-quantity-form/reject-quantity-form.component';
import { EquipmentComponent } from './manualentry/equipment/equipment.component';
import { CountryComponent } from './manualentry/country/country.component';
import { CompanyComponent } from './manualentry/company/company.component';
import { StateComponent } from './manualentry/state/state.component';
import { LocationComponent } from './manualentry/location/location.component';
import { PlantComponent } from './manualentry/plant/plant.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { PlantdowntimeComponent } from './manualentry/plantdowntime/plantdowntime.component';

import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import {
  DateTimeAdapter,
  OWL_DATE_TIME_FORMATS,
  OWL_DATE_TIME_LOCALE,
} from 'ng-pick-datetime';
// import { NgxDatetimeRangePickerModule } from 'wtime-range-picker';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { SetuptimeComponent } from './manualentry/setuptime/setuptime.component';
import { PreventivelistmasterComponent } from './manualentry/preventivelistmaster/preventivelistmaster.component';
import { LossmasterComponent } from './manualentry/lossmaster/lossmaster.component';
import { LossdailogComponent } from './manualentry/lossmaster/lossdailog/lossdailog.component';
import { GlobaltypeComponent } from './manualentry/globaltype/globaltype.component';
import { GlobaltypedailogComponent } from './manualentry/globaltype/globaltypedailog/globaltypedailog.component';
import { SkuformdailogComponent } from './manualentry/skuform/skuformdailog/skuformdailog.component';
import { BatchskuentryComponent } from './manualentry/batchskuentry/batchskuentry.component';
import { EmailtemplateComponent } from './manualentry/emailtemplate/emailtemplate.component';
import { GlobalkeymasterComponent } from './manualentry/globalkeymaster/globalkeymaster.component';
import { GlobalkeydailogComponent } from './manualentry/globalkeymaster/globalkeydailog/globalkeydailog.component';
import { Faultreport1Component } from './reports/faultreport1/faultreport1.component';
import { RejectreworkComponent } from './manualentry/rejectrework/rejectrework.component';
import { EmailtemplatedailogComponent } from './manualentry/emailtemplate/emailtemplatedailog/emailtemplatedailog.component';
import { EmailschedulerComponent } from './manualentry/emailscheduler/emailscheduler.component';
import { EmailschedulerdailogComponent } from './manualentry/emailscheduler/emailschedulerdailog/emailschedulerdailog.component';
import { EventChartHistoryComponent } from './reports/event-chart-history/event-chart-history.component';

import { TvScreenComponent } from './tv-screen/tv-screen.component';
import { Screen2Component } from './tv-screen/screen2/screen2.component';
import { Screen1Component } from './tv-screen/screen1/screen1.component';
import { Header2Component } from './tv-screen/screen2/header2/header2.component';
import { Header1Component } from './tv-screen/screen1/header1/header1.component';
import { PlantDiagramComponent } from './tv-screen/screen2/plant-diagram/plant-diagram.component';
import { MainHeaderComponent } from './tv-screen/main-header/main-header.component';
import { FaultListComponent } from './tv-screen/screen1/fault-list/fault-list.component';
import { FaultList2Component } from './tv-screen/screen2/fault-list2/fault-list2.component';
import { SummaryComponent } from './tv-screen/screen1/summary/summary.component';
import { SwitchingComponent } from './tv-screen/switching/switching.component';
import { OperatorentryComponent } from './manualentry/operatorentry/operatorentry.component';
import { OperatordailogentryComponent } from './manualentry/operatorentry/operatordailogentry/operatordailogentry.component';
import { UpdtdefinitionComponent } from './manualentry/updtdefinition/updtdefinition.component';
import { UpdtdefinitiondailogComponent } from './manualentry/updtdefinition/updtdefinitiondailog/updtdefinitiondailog.component';
import { FormatComponent } from './manualentry/format/format.component';
import { FormatdailogComponent } from './manualentry/format/formatdailog/formatdailog.component';
import { BatchwiseReportComponent } from './reports/batchwise-report/batchwise-report.component';
import { OperatorChartCompareComponent } from './reports/operator-chart-compare/operator-chart-compare.component';
import { AgGridTrailReportComponent } from './reports/ag-grid-trail-report/ag-grid-trail-report.component';
import { TrailGridComponent } from './reports/trail-grid/trail-grid.component';
import { MachinewiseOperatorComponent } from './manualentry/machinewise-operator/machinewise-operator.component';
import { FgexComponent } from './manualentry/fgex/fgex.component';
import { FgexdailogComponent } from './manualentry/fgex/fgexdailog/fgexdailog.component';
import { ChangeovertypeComponent } from './manualentry/changeovertype/changeovertype.component';
import { ChangeovertypedailogComponent } from './manualentry/changeovertype/changeovertypedailog/changeovertypedailog.component';
import { ChangeOver1Component } from './manualentry/change-over1/change-over1.component';
import { MatSelectFilterModule } from 'mat-select-filter';
import { AuthModule } from './../auth/auth.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { LiveViewsComponent } from './live-views/live-views.component';
import { DataService } from './data.service';
import { SharedModule } from '../shared/shared.module';

export const MY_MOMENT_FORMATS = {
  parseInput: 'LL LT',
  fullPickerInput: 'YYYY-MM-DD HH:mm' /* <---- Here i've rewrited the format */,
  datePickerInput: 'LL',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MM YYYY',
};

@NgModule({
  declarations: [
    IntasComponent,
    DashboardComponent,
    EventCausesDataTableComponent,

    MachineParametersTableComponent,
    MachineParametersChartsComponent,
    StopInputFormComponent,
    StopVideoComponent,
    CriticalMachineDataComponent,
    ShiftEndFormComponent,
    ShiftendReportComponent,
    ShiftEmailDailogComponent,
    ManualentryComponent,
    FaultcauseformComponent,
    LineformComponent,
    HolidaylistformComponent,
    WeeklyoffformComponent,
    ShiftbreakComponent,
    ShiftformComponent,
    SkuformComponent,
    WeeklyoffformComponent,
    SchedulemaintainenceformComponent,
    FaultcauseReportComponent,
    RejectQuantityFormComponent,
    FaultnameComponent,
    EquipmentComponent,
    CountryComponent,
    CompanyComponent,
    StateComponent,
    LocationComponent,
    PlantComponent,
    Manualentry1Component,
    Manualentry2Component,
    ScheduleComponent,
    ScheduleDialogComponent,
    DemoComponent,
    CalendarHeaderComponent,
    PlantdowntimeComponent,
    SetuptimeComponent,
    PreventivelistmasterComponent,
    LossmasterComponent,
    LossdailogComponent,
    GlobaltypeComponent,
    GlobaltypedailogComponent,
    SkuformdailogComponent,
    BatchskuentryComponent,
    EmailtemplateComponent,
    GlobalkeymasterComponent,
    GlobalkeydailogComponent,
    Faultreport1Component,
    RejectreworkComponent,
    EmailtemplatedailogComponent,
    EmailschedulerComponent,
    EmailschedulerdailogComponent,
    ChangeOverComponent,
    TvScreenComponent,
    Screen2Component,
    Screen1Component,
    Header2Component,
    Header1Component,
    PlantDiagramComponent,
    MainHeaderComponent,
    FaultListComponent,
    FaultList2Component,
    SummaryComponent,
    SwitchingComponent,
    EventChartHistoryComponent,
    OperatorentryComponent,
    OperatordailogentryComponent,
    ConfirmDialogueComponent,
    UpdtdefinitionComponent,
    UpdtdefinitiondailogComponent,
    FormatComponent,
    FormatdailogComponent,
    BatchwiseReportComponent,
    OperatorChartCompareComponent,
    AgGridTrailReportComponent,
    TrailGridComponent,
    MachinewiseOperatorComponent,
    FgexComponent,
    FgexdailogComponent,
    ChangeovertypeComponent,
    ChangeovertypedailogComponent,
    ChangeOver1Component,
    CtestOverComponent,
    WebDataRocksPivot,
    LiveViewsComponent,
  ],
  imports: [
    CommonModule,
    RoutingModule,


    SfwModulesModule,

    SharedModule,
    NgxMaterialTimepickerModule.setLocale('ar-AE'),
    MatVideoModule,
    NgxMaterialTimepickerModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxTrimDirectiveModule,
    MatSelectFilterModule,
    AuthModule,
  ],
  entryComponents: [
    StopInputFormComponent,
    StopVideoComponent,
    RejectQuantityFormComponent,
    ShiftEndFormComponent,
    ShiftEmailDailogComponent,
    ScheduleDialogComponent,
    LossdailogComponent,
    GlobaltypedailogComponent,
    SkuformdailogComponent,
    BatchskuentryComponent,
    GlobalkeydailogComponent,
    RejectreworkComponent,
    EmailtemplatedailogComponent,
    EmailschedulerdailogComponent,
    OperatordailogentryComponent,
    ConfirmDialogueComponent,
    UpdtdefinitiondailogComponent,
    FormatdailogComponent,
    FgexdailogComponent,
    ChangeovertypedailogComponent,
  ],
  providers: [
    DataService,

    EventsAnalysisService,

    DatePipe,
    ModuleService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'en-IN' },
  ],
})
export class IntasModule {}
