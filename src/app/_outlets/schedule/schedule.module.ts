import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScheduleRoutingModule } from './schedule-routing.module';
import { ScheduleComponent } from './schedule.component';
import { OperatorSchedulingComponent } from './operator-scheduling/operator-scheduling.component';
import { PdtSchedulingComponent } from './pdt-scheduling/pdt-scheduling.component';
import { ShiftSchedulingComponent } from './shift-scheduling/shift-scheduling.component';
import { MaintenanceSchedulingComponent } from './maintenance-scheduling/maintenance-scheduling.component';
import { SupervisorSchedulingComponent } from './supervisor-scheduling/supervisor-scheduling.component';


@NgModule({
  declarations: [ScheduleComponent, OperatorSchedulingComponent, PdtSchedulingComponent, ShiftSchedulingComponent, MaintenanceSchedulingComponent, SupervisorSchedulingComponent],
  imports: [
    CommonModule,
    ScheduleRoutingModule
  ]
})
export class ScheduleModule { }
