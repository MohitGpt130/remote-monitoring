import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { PrivilegesComponent } from './privileges/privileges.component';
import { DashboardComponent } from './dashboard/dashboard.component';


@NgModule({
  declarations: [AdminComponent, UsersComponent, RolesComponent, PrivilegesComponent, DashboardComponent],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
