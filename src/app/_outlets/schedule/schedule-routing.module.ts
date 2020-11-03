import { PdtSchedulingComponent } from './pdt-scheduling/pdt-scheduling.component';
import { OperatorSchedulingComponent } from './operator-scheduling/operator-scheduling.component';
import { ShiftSchedulingComponent } from './shift-scheduling/shift-scheduling.component';
import { SupervisorSchedulingComponent } from './supervisor-scheduling/supervisor-scheduling.component';
import { MaintenanceSchedulingComponent } from './maintenance-scheduling/maintenance-scheduling.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScheduleComponent } from './schedule.component';

const routes: Routes = [
  {
    path: '',
    component: ScheduleComponent,
    children: [
      {
        path: 'maintenance-scheduling',
        component: MaintenanceSchedulingComponent,
        pathMatch: 'full',
      },
      {
        path: 'pdt-scheduling',
        component: PdtSchedulingComponent,
        pathMatch: 'full',
      },
      {
        path: 'operator-scheduling',
        component: OperatorSchedulingComponent,
        pathMatch: 'full',
      },
      {
        path: 'shift-scheduling',
        component: ShiftSchedulingComponent,
        pathMatch: 'full',
      },
      {
        path: 'supervisor-scheduling',
        component: SupervisorSchedulingComponent,
        pathMatch: 'full',
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduleRoutingModule { }
