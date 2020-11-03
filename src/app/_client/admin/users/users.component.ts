import { ClientService } from './../../client.service';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectorRef,
  AfterViewChecked,
  AfterViewInit
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  User,
  UserProfile,
  UserWork,
  UserContacts,
  UserSocial,
  UserSettings
} from './user.model';
import { UsersService } from './users.service';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { RolesService } from '../roles/roles.service';
import { Subscription, Observable } from 'rxjs';
import { PrivilegesService } from '../privileges/privileges.service';
import { Router, Event, NavigationEnd, NavigationError } from '@angular/router';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { HttpClient } from '@angular/common/http';
import { WaMatConfirmDialog } from '@webacad/material-confirm-dialog';
import { AppSettings } from '../../app.settings';

interface MenuNode {
  title: string;
  code?: string;
  children?: MenuNode[];
}

interface RoleNode {
  name: string;
  code: string;
  title: string;
  treeNodes: MatTreeNestedDataSource<MenuNode>;
}
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [UsersService]
})
export class UsersComponent implements OnInit, AfterViewChecked, AfterViewInit {
  sub: Subscription;
  isLoaded = false;

  public users: any;
  public userCount = false;

  public userPrivileges;

  roleTreeNodes = {};

  gridView = true;
  viewType;

  usersViewStyle = 'grid';
  // public currentUserPrivileges;
  public roles = [];
  public allRoles = [];
  public routes = [];

  public usersRoles = {};
  public usersRole = {};
  public usersRolesNames = {};
  public usersRoleName = {};
  public usersRoutes = {};
  public usersHomeRoutes = {};
  public searchText: string;
  public page: any;
  public settings: any;

  public roleCtrl = new FormControl();
  public form: FormGroup;

  treeControl = new NestedTreeControl<MenuNode>(node => node.children);
  hasChild = (_: number, node: MenuNode) => !!node.children && node.children.length > 0;

  constructor(
    public appSettings: AppSettings,
    public appService: ClientService,
    public dialog: MatDialog,
    public usersService: UsersService,
    public rolesService: RolesService,
    public privilegesService: PrivilegesService,
    private formBuilder: FormBuilder,
    public cdRef: ChangeDetectorRef,
    public snackBar: MatSnackBar,
    public authService: AuthService,
    public router: Router,
    public httpClient: HttpClient,
    private confirmDialog: WaMatConfirmDialog,
  ) {
    this.settings = this.appSettings.settings;
    // this.authService.currentUser.subscribe(x => {
    //   this.currentUser = x;
    //   // this.currentUserRole = this.currentUser.roles[0].name;
    // });
    // this.authService.currentUserPrivileges.subscribe(x => x[0] && x[0].privileges && x[0].privileges.menus && x[0].privileges.menus.AdminUsers ? this.currentUserPrivilege = x[0].privileges.menus.AdminUsers : {});
  }

  ngOnInit(): void {
    this.appService
    .getDashboardSettings()
    .then((configs: any) => {
      this.isLoaded = true;

      this.sub = this.privilegesService.getPrivileges()
      .subscribe(data => {
        this.userPrivileges = data;
      });
    });
  }

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
    this.getRoles();
    this.getUsers();
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  getUsers(): void{
    this.sub = this.usersService.getUsers().subscribe(
      (users: any) => {
        if (this.authService.currentUserValue) {
          users = users.filter(
            user => user.email !== this.authService.currentUserValue.email
          );
          // if (users.length >= 7) {
          //   this.userCount = true;
          // }
          const currentUserRoles = [];
          this.authService.currentUserValue.user.roles.forEach(role =>
            currentUserRoles.push(role.name)
          );

          users = users.filter(
            user => !user.roles.some(role => currentUserRoles.includes(role.name))
          );
          users.forEach(user => {
            const userRole = {};
            this.usersRoleName[user.name] = {};
            this.usersRoutes[user.name] = [];
            this.usersHomeRoutes[user.name] = [];
            if (user && user.roles && user.roles.length > 0) {
              this.usersRoleName[user.name] = user.roles[0]._id;
              userRole[user.roles.name] = user.roles[0];
              this.usersRoles[user.name] = userRole;
            }
            this.privilegesService.getPrivileges().subscribe(p => {
              if (user.roles.length > 0 && user.roles[0].privileges && user.roles[0].privileges.menus ) {
                this.usersRoutes[user.name] = [];
                Object.keys(user.roles[0].privileges.menus).forEach(route => {
                    this.userPrivileges = p;
                    this.usersRoutes[user.name].push({name: route, link: this.userPrivileges.filter(up => up.name === route)[0].route.link});
                });
                // this.usersRoutes[user.name] = Object.keys(user.roles[0].privileges.menus);
              } else {
                  this.userPrivileges = p;
                  this.usersRoutes[user.name] = [];
                  this.userPrivileges.forEach(up => {
                    this.usersRoutes[user.name].push({name: up.name, link: up.route.link});
                  });
              }
            });
            this.usersHomeRoutes[user.name] = user.settings.homeRoute;
          });
          this.users = users;
        }
      },
      err => {}
    );
  }

  getRoles(): void {
    this.rolesService.getRoles().subscribe(roles => {
      this.allRoles = roles;
      const currentUserRoles = [];
      this.authService.currentUserValue.user.roles.forEach(role =>
        currentUserRoles.push(role.name)
      );
      this.allRoles = roles.filter(r => !currentUserRoles.includes(r.name));
    });
  }

  getRoless(): void {
    this.roles = null;
    this.rolesService.getRoles().subscribe(roles => {
      // this.roles = roles;
      this.roles = roles.filter(
        role => role.name !== 'user' && role.name !== 'admin'
      );

      roles.forEach((role: any) => {
        const roleNode: RoleNode = {
          name: role.name,
          code: role.code,
          title: role.title,
          treeNodes: new MatTreeNestedDataSource<MenuNode>()
        };

        const menus = [];
        if (role && role.privileges && role.privileges.menus) {
          // tslint:disable-next-line: forin
          for (const m in role.privileges.menus) {
            const components = [];
            // tslint:disable-next-line: forin
            for (const c in role.privileges.menus[m]) {
              const activities = [];
              // tslint:disable-next-line: forin
              for (const a in role.privileges.menus[m][c]) {
                activities.push({ name: a, title: a });
              }
              components.push({ name: c, children: activities });
            }
            menus.push({ name: m, children: components });
          }
        }

        roleNode.treeNodes.data = menus;
        this.roleTreeNodes[role.name] = roleNode;
      });
    });
  }

  public updateUserRoles(user, event): void {
    const cd = this.confirmDialog.open('Are you sure?');

    cd.afterClosed().subscribe((result: boolean) => {
        if (result) {
            this.usersService.updateUserRoles(user.name, event.value).subscribe(
              u => {
                this.snackBar.open('User Role Updated Successfully', '', {
                  duration: 3000
                });
                this.usersService.getUsers();
              },
              err => {
                this.snackBar.open('Failed to updated the User Role', '', {
                  duration: 3000,
                  panelClass: ['fail_color']
                });
              }
            );
        } else {
          this.snackBar.open('sorry, cancelled the change!', '', { duration: 2000 } );
          this.onPageChanged();
        }
    });

  }

  updateUserHomeRoutes(user, event): void {
    const cd = this.confirmDialog.open('Are you sure?');
    cd.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.usersService.updateUserHomeRoute(user.name, event.value).subscribe(
            u => {
              this.snackBar.open('User Route Updated Successfully', '', {
                duration: 3000
              });
              this.usersService.getUsers();
            },
            err => {
              this.snackBar.open('Failed to updated the User Route', '', {
                duration: 3000,
                panelClass: ['fail_color']
              });
            }
          );
        } else {
          this.snackBar.open('sorry, cancelled the change!', '', { duration: 2000 } );
          this.onPageChanged();
        }
    });

  }

  public addUser(user: any): void {
    // user.profile.contacts = user.contacts;
    // user.profile.social = user.social;
    user.picture = null;
    user.image = {};

    this.usersService.addUser(user).subscribe(
      u => {
        this.snackBar.open('User Created Successfully', '', { duration: 3000 });
        // if (!user.uploadFile) {
        //   this.usersService.uploadPhoto(user.name, user.uploadFile).subscribe(up => this.usersService.getUsers(), err => {
        //     this.snackBar.open(err.statusText, err.error.name, { duration: 3000 });
        //   });
        // } else {

        // }
        this.usersService.getUsers();
      },
      err => {
        this.snackBar.open('Failed to create the User', '', {
          duration: 3000,
          panelClass: ['fail_color']
        });
      }
    );
  }

  // public addUser(user: any) {
  //   user.profile.contacts = user.contacts;
  //   user.profile.social = user.social;
  //   user.profile.picture = null;
  //   user.profile.image = {};
  //   this.usersService.addUser(user).subscribe(u => {
  //     this.usersService.getUsers();
  //     this.usersService.uploadPhoto(user.name, user.uploadFile).subscribe(up => this.usersService.getUsers(), err => {
  //       this.snackBar.open(err.statusText, err.error.name, { duration: 3000 });
  //     });
  //   }, err => {
  //     this.snackBar.open(err.statusText, err.error.name, { duration: 3000 });
  //   });
  // }

  public updateUser(user: User): void {
    this.usersService.updateUser(user).subscribe(
      u => {
        this.snackBar.open('User Updated Successfully', '', { duration: 3000 });
        this.usersService.getUsers();
      },
      err => {
        this.snackBar.open('Failed to updated the User', '', {
          duration: 3000,
          panelClass: ['fail_color']
        });
      }
    );
  }

  public deleteUser(user: User): void {
    this.usersService.deleteUser(user.name).subscribe(
      u => {
        this.snackBar.open('User Deleted Successfully', '', { duration: 3000 });
        this.usersService.getUsers();
      },
      err => {
        this.snackBar.open('Failed to deleted the User', '', {
          duration: 3000,
          panelClass: ['fail_color']
        });
      }
    );
  }

  public changeUserActivation(user, activation: boolean): void {
    // user.settings.isDeleted = !user.settings.isDeleted
    this.usersService
      .changeUserActivation(user.name, activation)
      .subscribe(u => {
        this.usersService.getUsers();
        this.appService.socket.emit('activity', { email: this.authService.currentUserValue.user.email, activity: 'deactivate', subject: user.email });
      });
  }

  public onPageChanged(event?): void {
    this.page = event;
    this.usersService.getUsers();
    if (this.settings.fixedHeader) {
      document.getElementById('main-content').scrollTop = 0;
    } else {
      document.getElementsByClassName('mat-drawer-content')[0].scrollTop = 0;
    }
  }

  public uploadPhoto(user: any, file): void {
    this.usersService
      .uploadPhoto(user.name, file)
      .subscribe(u => this.usersService.getUsers());
  }

  public openUserDialog(user): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      data: {
        user,
        privileges: this.userPrivileges,
        roles: this.allRoles,
      }
    });

    dialogRef.afterClosed().subscribe(u => {
      if (u) {
        u.id ? this.updateUser(u) : this.addUser(u);
      }
    });
  }

  public sendVerificationCode(userEmail: string): void {
    this.usersService.sendVerificationCode(userEmail).subscribe(
      u => {
        this.snackBar.open(
          'Verification Code will be sent through email within a short period',
          '',
          { duration: 3000 }
        );
        this.usersService.getUsers();
      },
      err => {
        this.snackBar.open('Failed to send the verification code', '', {
          duration: 3000,
          panelClass: ['fail_color']
        });
      }
    );
  }

  checkUserCountSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 3000
    });
  }
}
