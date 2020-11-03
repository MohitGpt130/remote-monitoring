import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterRoutingModule } from './master-routing.module';
import { EmailTemplateMasterComponent } from './email-template-master/email-template-master.component';
import { EventCauseMasterComponent } from './event-cause-master/event-cause-master.component';
import { CompanyMasterComponent } from './company-master/company-master.component';
import { CountryMasterComponent } from './country-master/country-master.component';
import { PlantMasterComponent } from './plant-master/plant-master.component';
import { LineMasterComponent } from './line-master/line-master.component';
import { EquipmentMasterComponent } from './equipment-master/equipment-master.component';
import { OperatorMasterComponent } from './operator-master/operator-master.component';
import { MasterComponent } from './master.component';
import { EventClassificationMasterComponent } from './event-classification-master/event-classification-master.component';
import { EquipmentStatusComponent } from './equipment-status/equipment-status.component';

@NgModule({
  declarations: [EmailTemplateMasterComponent, EventCauseMasterComponent, CompanyMasterComponent, CountryMasterComponent, PlantMasterComponent, LineMasterComponent, EquipmentMasterComponent, OperatorMasterComponent, MasterComponent, EventClassificationMasterComponent, EquipmentStatusComponent],
  imports: [
    CommonModule,
    MasterRoutingModule
  ]
})
export class MasterModule { }
