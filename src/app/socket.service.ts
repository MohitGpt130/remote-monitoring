import { Observer, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import {
  NavigationStart,
  NavigationError,
  NavigationEnd,
  RouteConfigLoadEnd,
  Router,
  Event,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  connectionStabledObserver: Observer<boolean>;
  connectionsCountObserver: Observer<number>;
  connectionStatusObserver: Observer<string>;
  connectionMessageObserver: Observer<string>;
  connectionAuthObserver: Observer<any>;
  activityObserver: Observer<any>;

  socketConfigs;
  socket;
  connectionStatus: any;

  constructor(private httpClient: HttpClient, private router: Router) {
    this.httpClient
      .get('configs/sockets.config.json')
      .subscribe((socketConfigs: any) => {
        this.socketConfigs = socketConfigs;
        const socketUrl = socketConfigs.connection;
        this.socket = this.activateSocket(
          socketUrl,
          this.connectionStabledObserver
        );
        this.socket.on('count', (data) => {
          console.log('count');
          this.connectionsCountObserver.next(data);
        });
        this.socket.on('status', (data) => {
          console.log('status');
          this.connectionStatus = data;
          this.connectionStabledObserver.next(true);
          this.connectionStatusObserver.next(data);
        });
        this.socket.on('message', (data) => {
          console.log('message');

          this.connectionMessageObserver.next(data);
        });
        this.socket.on('auth', (data) => {
          console.log('auth');

          this.socket.emit(
            'auth',
            JSON.parse(localStorage.getItem('currentUser'))
          );
          this.connectionAuthObserver.next(data);
        });
        this.socket.on('routes', (data) => {
          console.log('routes');
          console.log(this.router.config);
          this.router.config.forEach((route) => {
            console.log(route);
            if (route.children) {
              route.children.forEach((element) => {
                console.log(route, element.path);
                // console.log(route['_loadedConfig']);
                // route['_loadedConfig'].routes.forEach(element => {

                // });
              });
            }
          });
          this.socket.on('activity', (data) => {
            this.activityObserver.next(data);
          });
        });
        // this.socket.emit('routes', this.routerConfig);
      });
  }

  activateSocket(socketUrl, connectionStabledObserver): Socket {
    let socket;
    socket = new Socket({
      url: socketUrl,
      options: {},
    });

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Show loading indicator
      }

      if (event instanceof NavigationEnd) {
        socket.emit('message', {
          url: event.url,
          urlAfterRedirects: event.urlAfterRedirects,
        });
      }

      if (event instanceof NavigationError) {
        console.log(event.error);
      }

      if (event instanceof RouteConfigLoadEnd) {
      }
    });

    // socket.emit('auth', JSON.parse(localStorage.getItem('currentUser')));
    socket.emit('message', 'hi');
    socket = this.socketDefaultEvents(socket, connectionStabledObserver);
    return socket;
  }

  socketDefaultEvents(socket: Socket, connectionStabledObserver): Socket {
    socket.on('connect', () => {
      console.log('connected');
      connectionStabledObserver.next(true);
    });
    socket.on('connect_error', () => {
      console.log('connect_error');
      // if(this.connectionStatus)
      if (this.connectionStatus) {
        this.connectionStatus.status = 'connect_error';
      }
      // this.connectionStatusObserver.next(this.connectionStatus);
      // if(connectionStabledObserver) this.connectionStabledObserver.next(false);
    });
    socket.on('connect_timeout', () => {
      console.log('connect_timeout');
      // connectionStabledObserver.next(false);
    });
    socket.on('disconnect', () => {
      console.log('disconnect');
      connectionStabledObserver.next(false);
      if (this.connectionStatus) {
        this.connectionStatus.status = 'internet_issue';
      }
      this.connectionStatusObserver.next(this.connectionStatus);
    });
    socket.on('connect_failed', () => {
      console.log('connect_failed');
      if (this.connectionStatus) {
        this.connectionStatus.status = 'connect_failed';
      }
      this.connectionStatusObserver.next(this.connectionStatus);
    });
    socket.on('reconnect', () => {
      console.log('reconnect');
      if (this.connectionStatus) {
        this.connectionStatus.status = 'reconnect';
      }
      this.connectionStatusObserver.next(this.connectionStatus);
    });
    socket.on('reconnect_attempt', () => {
      console.log('reconnect_attempt');
      if (this.connectionStatus) {
        this.connectionStatus.status = 'reconnect_attempt';
      }
      this.connectionStatusObserver.next(this.connectionStatus);
    });
    socket.on('reconnecting', () => {
      console.log('reconnecting');
      if (this.connectionStatus) {
        this.connectionStatus.status = 'reconnecting';
      }
      this.connectionStatusObserver.next(this.connectionStatus);
    });
    socket.on('reconnect_error', () => {
      console.log('reconnect_error');
      if (this.connectionStatus) {
        this.connectionStatus.status = 'reconnect_error';
      }
      this.connectionStatusObserver.next(this.connectionStatus);
    });
    socket.on('reconnect_failed', () => {
      console.log('reconnect_failed');
      if (this.connectionStatus) {
        this.connectionStatus.status = 'reconnect_failed';
      }
      this.connectionStatusObserver.next(this.connectionStatus);
    });
    socket.on('ping', () => {
      console.log('ping');
    });
    socket.on('pong', () => {
      console.log('pong');
    });
    return socket;
  }

  getConnectionStabled(): Observable<boolean> {
    return new Observable((observer) => {
      this.connectionStabledObserver = observer;
    });
  }

  getConnectionsCount(): Observable<number> {
    return new Observable((observer) => {
      this.connectionsCountObserver = observer;
    });
  }

  getConnectionStatus(): Observable<string> {
    return new Observable((observer) => {
      this.connectionStatusObserver = observer;
    });
  }

  getConnectionMessage(): Observable<string> {
    return new Observable((observer) => {
      this.connectionMessageObserver = observer;
    });
  }

  getConnectionAuth(): Observable<any> {
    return new Observable((observer) => {
      this.connectionAuthObserver = observer;
    });
  }

  getActivityCommands(): Observable<any> {
    return new Observable((observer) => {
      this.activityObserver = observer;
    });
  }
}
