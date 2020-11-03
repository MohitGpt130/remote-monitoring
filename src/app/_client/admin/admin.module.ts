import { AdminLayoutModule } from './admin-layout/admin-layout.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { RolesComponent } from './roles/roles.component';
import { UsersComponent } from './users/users.component';
import { PrivilegesComponent } from './privileges/privileges.component';
import { SharedModule } from '../shared/shared.module';
import { UsersService } from './users/users.service';
import { RolesService } from './roles/roles.service';
import { MenuService } from '../shared/components/menu/menu.service';
import { PrivilegesService } from './privileges/privileges.service';
import { UserDialogComponent } from './users/user-dialog/user-dialog.component';
import { RoleDialogComponent } from './roles/role-dialog/role-dialog.component';
import { ComponentDialogComponent } from './privileges/component-dialog/component-dialog.component';
import { RouteDialogComponent } from './privileges/route-dialog/route-dialog.component';
import { MenuDialogComponent } from './privileges/menu-dialog/menu-dialog.component';
import { ActivityDialogComponent } from './privileges/activity-dialog/activity-dialog.component';

@NgModule({
  declarations: [
    AdminComponent, UsersComponent, RolesComponent, PrivilegesComponent,
    UserDialogComponent, RoleDialogComponent, MenuDialogComponent, ComponentDialogComponent, ActivityDialogComponent, RouteDialogComponent,
  ],
  imports: [
    CommonModule,

    SharedModule,
    AdminRoutingModule,
    AdminLayoutModule,
  ],
  exports: [
    SharedModule
  ],
  providers: [
    UsersService,
    RolesService,
    MenuService,
    PrivilegesService,

  ],
  entryComponents: [
    UserDialogComponent, RoleDialogComponent,
    MenuDialogComponent, ComponentDialogComponent,
    ActivityDialogComponent, RouteDialogComponent,
  ]
})
export class AdminModule { }
