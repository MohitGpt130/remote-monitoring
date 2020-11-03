import { EventClassificationMasterComponent } from './event-classification-master/event-classification-master.component';
import { EquipmentStatusComponent } from './equipment-status/equipment-status.component';
import { EventCauseMasterComponent } from './event-cause-master/event-cause-master.component';
import { EmailTemplateMasterComponent } from './email-template-master/email-template-master.component';
import { OperatorMasterComponent } from './operator-master/operator-master.component';
import { EquipmentMasterComponent } from './equipment-master/equipment-master.component';
import { LineMasterComponent } from './line-master/line-master.component';
import { PlantMasterComponent } from './plant-master/plant-master.component';
import { CountryMasterComponent } from './country-master/country-master.component';
import { CompanyMasterComponent } from './company-master/company-master.component';
import { MasterComponent } from './master.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: MasterComponent,
    children: [
      {
        path: 'company-master',
        component: CompanyMasterComponent,
        pathMatch: 'full',
      },
      {
        path: 'country-master',
        component: CountryMasterComponent,
        pathMatch: 'full',
      },
      {
        path: 'plant-master',
        component: PlantMasterComponent,
        pathMatch: 'full',
      },
      {
        path: 'line-master',
        component: LineMasterComponent,
        pathMatch: 'full',
      },
      {
        path: 'equipment-master',
        component: EquipmentMasterComponent,
        pathMatch: 'full',
      },
      {
        path: 'operator-master',
        component: OperatorMasterComponent,
        pathMatch: 'full',
      },
      {
        path: 'email-template-master',
        component: EmailTemplateMasterComponent,
        pathMatch: 'full',
      },
      {
        path: 'event-causes-master',
        component: EventCauseMasterComponent,
        pathMatch: 'full',
      },
      {
        path: 'equipment-status-master',
        component: EquipmentStatusComponent,
        pathMatch: 'full',
      },
      {
        path: 'event-classification-master',
        component: EventClassificationMasterComponent,
        pathMatch: 'full',
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
