import { Injectable } from '@angular/core';
import { Observer, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError, RouteConfigLoadEnd, ActivatedRoute } from '@angular/router';
import { AppSettings } from './app.settings';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  users = 0;

  connectionStabledObserver: Observer<boolean>;
  connectionsCountObserver: Observer<number>;
  connectionStatusObserver: Observer<string>;
  connectionMessageObserver: Observer<string>;
  connectionAuthObserver: Observer<any>;

  activityObserver: Observer<any>;

  config;
  apiConfigs;
  socketConfigs;
  socket;

  dashboardConfigs;
  appLayoutSettings;

  linesConfigsObserver: Observer<any>;
  linesConfigs;

  public connectionSocket;

  constructor(private httpClient: HttpClient, private router: Router, private activatedRoute: ActivatedRoute, private appSettings: AppSettings) {
    this.getConnectionStabled().subscribe();
    this.getConnectionsCount().subscribe();
    this.getConnectionStatus().subscribe();
    this.getConnectionMessage().subscribe();
    this.getConnectionAuth().subscribe();
    this.getActivityCommands().subscribe();

    this.httpClient
      .get('configs/sockets.config.json')
      .subscribe((socketConfigs: any) => {
        this.socketConfigs = socketConfigs;
        const socketUrl = socketConfigs.connection;
        this.socket = this.activateSocket(socketUrl, this.connectionStabledObserver);
        this.socket.on('connect_error', (data) => {
          this.connectionStabledObserver.next(false);
        });
        this.socket.on('count', (data) => {
          this.connectionsCountObserver.next(data);
        });
        this.socket.on('status', (data) => {
          this.connectionStatusObserver.next(data);
        });
        this.socket.on('message', (data) => {
          this.connectionMessageObserver.next(data);
        });
        this.socket.on('auth', (data) => {
          this.socket.emit('auth', JSON.parse(localStorage.getItem('currentUser')));
          this.connectionAuthObserver.next(data);
        });
        this.socket.on('routes', (data) => {
          console.log(this.router.config);
          this.router.config.forEach(route => {
            console.log(route);
            if(route.children) {
              route.children.forEach(element => {
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

  configureAPIs(apiConfigs): any {
    if (apiConfigs.apis) {
      Object.keys(apiConfigs.apis).forEach(apiRoute => {
        Object.keys(apiConfigs.apis[apiRoute]).forEach((element) => {
          apiConfigs.apis[apiRoute][element] =
            apiConfigs.host +
            apiConfigs.apis[apiRoute][element];
        });
      });
    }
    return apiConfigs;
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
        socket.emit('message', { url: event.url, urlAfterRedirects: event.urlAfterRedirects });
      }

      if (event instanceof NavigationError) {
        console.log(event.error);
      }

      if (event instanceof RouteConfigLoadEnd) {
      }

    });

    // socket.emit('auth', JSON.parse(localStorage.getItem('currentUser')));
    socket.emit('message', 'hi');
    socket = this.socketDefaultEvents(socket, this.connectionStabledObserver);
    return socket;
  }

  socketDefaultEvents(socket: Socket, connectionStabledObserver): Socket {
    socket.on('connect', () => {
      console.log('connected');
      if(connectionStabledObserver) connectionStabledObserver.next(true);
    });
    socket.on('connect_error', () => {
      // if(connectionStabledObserver) this.connectionStabledObserver.next(false);
    });
    socket.on('connect_timeout', () => {
      connectionStabledObserver.next(false);
    });
    socket.on('disconnect', () => {
      if(connectionStabledObserver) connectionStabledObserver.next(false);
    });
    socket.on('connect_failed', () => {
      if(connectionStabledObserver) connectionStabledObserver.next(false);
    });
    socket.on('reconnect', () => {
    });
    socket.on('reconnect_attempt', () => {
    });
    socket.on('reconnecting', () => {
    });
    socket.on('reconnect_error', () => {
    });
    socket.on('reconnect_failed', () => {
    });
    socket.on('ping', () => {
    });
    socket.on('pong', () => {
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

  async getDashboardSettings(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.config) {
        resolve({apiConfigs: this.apiConfigs, dashboardConfigs: this.dashboardConfigs});
      } else {
        this.httpClient
          .get('configs/api.config.json')
          .subscribe((apiConfigs: any) => {
            apiConfigs = this.configureAPIs(apiConfigs);
            this.apiConfigs = apiConfigs;
            this.httpClient
              .get('configs/dashboard.config.json')
              .subscribe((dashboardConfigs: any) => {
                this.dashboardConfigs = dashboardConfigs;
                this.appLayoutSettings = dashboardConfigs.layoutSettings;
                this.appLayoutSettings = this.appSettings.setAppSettings(this.appLayoutSettings);
                resolve({apiConfigs, dashboardConfigs});
              });
          });
      }
      // if(apiConfigs && dashboardConfigs) {
      // } else {
      //   reject('error');
      // }
    });
  }

  getLinesConfiguration(): Observable<any> {
    this.httpClient
      .get('/configs/lines.config.json')
      .subscribe((linesConfigs) => {
        this.linesConfigs = linesConfigs;
        this.linesConfigsObserver.next(linesConfigs);
      });

    return new Observable<any>((observer) => {
      this.linesConfigsObserver = observer;
    });
  }

  getActivityCommands(): Observable<any> {
    return new Observable((observer) => {
      this.activityObserver = observer;
    });
  }

}
