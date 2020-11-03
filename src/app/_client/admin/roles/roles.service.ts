import { Injectable, NgModule, OnInit } from '@angular/core';
import { Observable, Observer, config, BehaviorSubject } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { HttpClient } from '@angular/common/http';
import { ClientService } from '../../client.service';

@Injectable()
export class RolesService {
  roles;
  rolesObserver = new BehaviorSubject(null);
  public apiConfigs;
  socket;

  constructor(private appService: ClientService, public httpClient: HttpClient) {
    this.httpClient
        .get('configs/sockets.config.json')
        .subscribe((socketConfigs: any) => {
          const socketUrl = socketConfigs.admin.roles;
          this.socket = this.appService.activateSocket(socketUrl, null);
          this.socket.on('connect_error', (data) => {
          });
          this.socket.on('data', (data) => {
            this.rolesObserver.next(data);
            this.roles = data;
          });
          this.socket.emit('get', {data: 'roles'});
        });
  }

  getRoles(): Observable<any> {
    return this.httpClient.get(this.appService.apiConfigs.apis.admin.roles);
  }

  addRole(role: any) {
    return this.httpClient.post(this.appService.apiConfigs.apis.admin.roles , role);
  }

  updateRole(role: any) {
    return this.httpClient.put(this.appService.apiConfigs.apis.admin.roles, role);
  }

  deleteRole(name: string) {
    return this.httpClient.delete(this.appService.apiConfigs.apis.admin.roles + '/' + name);
  }
}
