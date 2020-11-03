import { Privilege, PrivilegeComponent, PrivilegeComponentActivity } from './privilege.model';
import { Injectable, NgModule, OnInit } from '@angular/core';
// import { Privilege, PrivilegeComponent, PrivilegeComponentActivity } from './menu.model';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer, BehaviorSubject } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { ClientService } from '../../client.service';

@Injectable()
export class PrivilegesService {
  menusObserver = new BehaviorSubject(null);
  public apiConfigs;
  // userPrivileges;
  // userPrivilegesObserver: Observer<any>;

  privileges;
  privilegesObserver: Observer<any>;
  socket;

  constructor(
    private appService: ClientService, public httpClient: HttpClient,
    ) {
      this.httpClient
        .get('configs/sockets.config.json')
        .subscribe((socketConfigs: any) => {
          const socketUrl = socketConfigs.admin.privileges;
          this.socket = this.appService.activateSocket(socketUrl, null);
          this.socket.on('connect_error', (data) => {
          });
          this.socket.on('data', (data) => {
            this.privileges = data;
          });

          this.socket.on('data', (data) => {
            localStorage.setItem('userPrivileges', JSON.stringify(data));
            this.privileges = data;
          });
        });
  }

  getPrivileges(): Observable<any> {
    return this.httpClient.get(this.appService.apiConfigs.apis.admin .menus + '');
    // this.privilegesSocket.emit('get', { data: 'privileges' });
    return new Observable(observer => {
      this.privilegesObserver = null;
    });
  }

  getUserPrivileges(): Observable<any> {
    return this.httpClient.get('http://103.205.66.73:1723/api/manual/company');
  }

  addPrivilege(privilege: any) {
    return this.httpClient.post(this.appService.apiConfigs.privileges, privilege);
  }

  updatePrivilege(privilege: any) {
    return this.httpClient.put(this.appService.apiConfigs.privileges, privilege);
  }

  deletePrivilege(name: string) {
    return this.httpClient.delete(this.appService.apiConfigs.privileges + '/' + name);
  }

  getMenus(): Observable<any> {
    return this.httpClient.get(this.appService.apiConfigs.apis.admin. menus);
    // this.menusSocket.emit('get', {data: 'menus'});
    // return new Observable(observer => {
    //   this.menusObserver = observer;
    // });
  }

  getRoutes() {
    return this.httpClient.get(this.appService.apiConfigs.apis.admin.menus + '/routes');
  }

  createMenu(menu: Privilege) {
    return this.httpClient.post(this.appService.apiConfigs.apis.admin.menus , menu);
  }

  updateMenu(menu: Privilege) {
    return this.httpClient.put(this.appService.apiConfigs.apis.admin.menus, menu);
  }

  deleteMenu(name: string) {
    return this.httpClient.delete(this.appService.apiConfigs.apis.admin.menus + '/' + name);
  }

  getComponents(menu: Privilege): Observable<PrivilegeComponent[]> {
    return this.httpClient.get<PrivilegeComponent[]>(this.appService.apiConfigs.apis.admin.menus + '/' + menu.name + '/components');
  }

  createComponent(menu: Privilege, component: PrivilegeComponent) {
    return this.httpClient.post(this.appService.apiConfigs.apis.admin.menus + '/' + menu.name + '/components', component);
  }

  updateComponent(menu: Privilege, component: PrivilegeComponent) {
    return this.httpClient.put(this.appService.apiConfigs.apis.admin.menus + '/' + menu.name + '/components', component);
  }

  deleteComponent(menu: Privilege, componentName: string) {
    return this.httpClient.delete(this.appService.apiConfigs.apis.admin.menus + '/' + menu.name + '/components/' + componentName);
  }

  getActivities(menu: Privilege, componentName: string): Observable<PrivilegeComponentActivity[]> {
    return this.httpClient.get<PrivilegeComponentActivity[]>(this.appService.apiConfigs.apis.admin.menus + '/' + menu.name + '/components/' + componentName + '/activities');
  }

  createActivity(menu: Privilege, component: PrivilegeComponent, activity: PrivilegeComponentActivity) {
    return this.httpClient.post(this.appService.apiConfigs.apis.admin.menus + '/' + menu.name + '/components/' + component.name + '/activities', activity);
  }

  updateActivity(menu: Privilege, component: PrivilegeComponent, activity: PrivilegeComponentActivity) {
    return this.httpClient.put(this.appService.apiConfigs.apis.admin.menus + '/' + menu.name + '/components/' + component.name + '/activities', activity);
  }

  deleteActivity(menu: Privilege, component: PrivilegeComponent, activityName: string) {
    return this.httpClient.delete(this.appService.apiConfigs.apis.admin.menus + '/' + menu.name + '/components/' + component.name + '/activities/' + activityName);
  }

}

