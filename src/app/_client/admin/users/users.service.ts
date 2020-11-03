import { Injectable, NgModule, OnInit } from '@angular/core';
import { Observable, Observer, config, BehaviorSubject } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';
import { ClientService } from '../../client.service';


@Injectable()
export class UsersService {
  users;
  usersObserver: Observer<any>;
  public apiConfigs;
  socket;
  connectionStabledObserver: Observer<boolean>;

  constructor(private appService: ClientService, public httpClient: HttpClient) {
    this.httpClient
    .get('configs/sockets.config.json')
    .subscribe((socketConfigs: any) => {
      const socketUrl = socketConfigs.admin.users;
      this.socket = this.appService.activateSocket(socketUrl, null);
      // this.socket.emit('get', {data: 'users'});
      this.socket.on('data', (data) => {
        // this.usersObserver.next(data);
        this.users = data;
      });
    });
  }

  getUsers(): Observable<any> {
    this.httpClient.get(this.appService.apiConfigs.apis.admin.users).subscribe(data => this.usersObserver.next(data));

    return new Observable((observer) => {
      this.usersObserver = observer;
    });
  }

  addUser(user: any) {
    return this.httpClient.post(this.appService.apiConfigs.apis.admin.users, user);
  }

  updateUser(user: any) {
    return this.httpClient.put(this.appService.apiConfigs.apis.admin.users, user);
  }

  updateUserRoles(username: string, roles: string[]) {
    return this.httpClient.post(this.appService.apiConfigs.apis.admin.users + '/' + username + '/roles', { roles });
  }

  updateUserHomeRoute(username: string, homeRoute: string) {
    return this.httpClient.post(this.appService.apiConfigs.apis.admin.users + '/' + username + '/home-route', { homeRoute });
  }

  changeUserActivation(username: string, isActive: boolean) {
    return this.httpClient.post(this.appService.apiConfigs.apis.admin.users + '/' + username + '/activation', { isActive });
  }

  uploadPhoto(username, file) {
    const formData = new FormData();
    formData.append('image', file, file.name);
    return this.httpClient.post(this.appService.apiConfigs.apis.admin.users + '/' + username + '/photo', formData);
  }

  deleteUser(name: string) {
    return this.httpClient.delete(this.appService.apiConfigs.apis.admin.users + '/' + name);
  }

  sendVerificationCode(email: string) {
    return this.httpClient.post(this.appService.apiConfigs.apis.auth.sendEmailToken + email, {});
  }
}
