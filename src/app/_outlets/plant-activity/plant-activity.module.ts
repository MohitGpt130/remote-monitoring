import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlantActivityRoutingModule } from './plant-activity-routing.module';
import { BatchChangeComponent } from './batch-change/batch-change.component';
import { SkuChangeComponent } from './sku-change/sku-change.component';
import { RejectReworkComponent } from './reject-rework/reject-rework.component';
import { UpdtClassificationComponent } from './updt-classification/updt-classification.component';
import { EventCauseOrCommentsComponent } from './event-cause-or-comments/event-cause-or-comments.component';
import { EmailCircularComponent } from './email-circular/email-circular.component';
import { PlantActivityComponent } from './plant-activity.component';

@NgModule({
  declarations: [BatchChangeComponent, SkuChangeComponent, RejectReworkComponent, UpdtClassificationComponent, EventCauseOrCommentsComponent, EmailCircularComponent, PlantActivityComponent],
  imports: [
    CommonModule,
    PlantActivityRoutingModule
  ]
})
export class PlantActivityModule { }
