import { PrivilegesService } from './privileges.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MenuDialogComponent } from './menu-dialog/menu-dialog.component';
import { ComponentDialogComponent } from './component-dialog/component-dialog.component';
import { ActivityDialogComponent } from './activity-dialog/activity-dialog.component';
import { AuthService } from '../../auth/auth.service';
import { Privilege, PrivilegeComponentActivity, PrivilegeComponent } from './privilege.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AppSettings } from '../../app.settings';

@Component({
  selector: 'app-privileges',
  templateUrl: './privileges.component.html',
  styleUrls: ['./privileges.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [PrivilegesService]
})
export class PrivilegesComponent implements OnInit {
  public searchText: string;
  public page: any;
  public settings: any;
  selectedMenu;
  selectedMenuComponents: [PrivilegeComponent];
  selectedComponent;
  selectedComponentActivities: [PrivilegeComponentActivity];
  selectedActivity;
  privileges;

  // constructor(private privilegesService: PrivilegesService) { }

  // ngOnInit() {
  // }

  // async getPrivileges() {
  //   this.privileges = null;
  //   return await this.privilegesService.getPrivileges().subscribe((roles: any) => {
  //     this.privileges = roles;
  //   }, (err) => {

  //   });
  // }

  constructor(
    public appSettings: AppSettings,
    public dialog: MatDialog,
    public privilegesService: PrivilegesService,
    public authService: AuthService,
    private _snackBar: MatSnackBar,

  ) {
    this.settings = this.appSettings.settings;
    // this.authService.currentUserPrivileges.subscribe(x => x[0] && x[0].privileges && x[0].privileges.menus && x[0].privileges.menus.AdminMenus ? this.currentUserPrivilege = x[0].privileges.menus.AdminMenus : {});
  }

  ngOnInit() {
    this.settings = this.appSettings.settings;
    // this.authService.currentUser.subscribe(x => {
    //   this.currentUser = x;
    //   if (this.currentUser && this.currentUser.roles.length > 0) {
    //     this.currentUserRole = this.currentUser.roles[0].name;
    //   }
    // });
    this.getPrivileges();
  }

  openToast(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000
    });
  }
  public getPrivileges() {
    this.privileges = null;
    this.privilegesService.getPrivileges().subscribe(privileges => {
      this.privileges = privileges;
      this.openToast('Select menu to view its component and activity', '' );
    });

  }
  public createMenu(menu: Privilege) {
    this.privilegesService.createMenu(menu).subscribe(m => {
          this._snackBar.open('Menu/Route Created Successfully', '', { duration: 3000 });
          this.getPrivileges();
      }, err => {
        this._snackBar.open('Failed to create Menu/Route', '', { duration: 3000, panelClass: [ 'fail_color']});
      });
  }
  public updateMenu(menu: Privilege) {
    this.privilegesService.updateMenu(menu).subscribe(m => {
      this._snackBar.open('Menu/Route Updated Successfully', '', { duration: 3000 });
      this.getPrivileges();
  }, err => {

    this._snackBar.open('Failed to update Menu/Route', '', { duration: 3000, panelClass: [ 'fail_color']});
   });
  }
  public deleteMenu(menu: Privilege) {
    this.privilegesService.deleteMenu(menu.name).subscribe(m => {
      this._snackBar.open('Menu/Route Deleted Successfully', '', { duration: 3000 });
      this.getPrivileges();
  }, err => {

    this._snackBar.open('Failed to delete Menu/Route', '', { duration: 3000 , panelClass: [ 'fail_color']});
   });
  }


  public createComponent(component: PrivilegeComponent) {
    this.privilegesService.createComponent(this.selectedMenu, component).subscribe(m =>{
      this._snackBar.open('Component Created Successfully', '', { duration: 3000 });
      this.getPrivileges();
  }, err => {

    this._snackBar.open('Failed to create Component', '', { duration: 3000, panelClass: [ 'fail_color']});
  });
  }
  public updateComponent(component: PrivilegeComponent) {
    this.privilegesService.updateComponent(this.selectedMenu , component).subscribe(m =>  {
      this._snackBar.open('Component Updated Successfully', '', { duration: 3000 });
      this.getPrivileges();
  }, err => {

    this._snackBar.open('Failed to update Component', '', { duration: 3000, panelClass: [ 'fail_color']});
   });
  }
  public deleteComponent(component: PrivilegeComponent) {
    this.privilegesService.deleteComponent(this.selectedMenu, component.name).subscribe(m => {
      this._snackBar.open('Component Deleted Successfully', '', { duration: 3000 });
      this.getPrivileges();
  }, err => {

    this._snackBar.open('Failed to delete Component', '', { duration: 3000, panelClass: [ 'fail_color']});
   });
  }

  public createActivity(activity: PrivilegeComponentActivity) {
    this.privilegesService.createActivity(this.selectedMenu, this.selectedComponent, activity).subscribe(m => {
      this._snackBar.open('Activity Created Successfully', '', { duration: 3000 });
      this.getPrivileges();
  }, err => {

    this._snackBar.open('Failed to create Actvity', '', { duration: 3000, panelClass: [ 'fail_color']});
  });
  }
  public updateActivity(activity: PrivilegeComponentActivity) {
    this.privilegesService.updateActivity(this.selectedMenu, this.selectedComponent, activity).subscribe(m => {
      this._snackBar.open('Activity Updated Successfully', '', { duration: 3000 });
      this.getPrivileges();
  }, err => {

    this._snackBar.open('Failed to Activity Component', '', { duration: 3000, panelClass: [ 'fail_color']});
   });
  }
  public deleteActivity(activity: PrivilegeComponentActivity) {
    this.privilegesService.deleteActivity(this.selectedMenu, this.selectedComponent, activity.name).subscribe(m => {
      this._snackBar.open('Activity Deleted Successfully', '', { duration: 3000 });
      this.getPrivileges();
  }, err => {

    this._snackBar.open('Failed to delete Activity', '', { duration: 3000, panelClass: [ 'fail_color']});
   });
  }

  public onPageChanged(event) {
    this.page = event;
    this.getPrivileges();
    if (this.settings.fixedHeader) {
      document.getElementById('main-content').scrollTop = 0;
    } else {
      document.getElementsByClassName('mat-drawer-content')[0].scrollTop = 0;
    }
  }

  public openMenuDialog(menu) {
    let dialogRef = this.dialog.open(MenuDialogComponent, {
      data: menu
    });

    dialogRef.afterClosed().subscribe(m => {
      if (m) {
        (m.id) ? this.updateMenu(m) : this.createMenu(m);
      }
    });
  }

  public openComponentDialog(component) {
    let dialogRef = this.dialog.open(ComponentDialogComponent, {
      data: component
    });

    dialogRef.afterClosed().subscribe(c => {
      if (c) {
        (c.id) ? this.updateComponent(c) : this.createComponent(c);
        this.ngOnInit();
        this.selectedMenu = null;
        this.selectedComponent = null;
        this.selectedActivity = null;
      }
    });
  }

  public openActivityDialog(activity) {
    let dialogRef = this.dialog.open(ActivityDialogComponent, {
      data: activity
    });

    dialogRef.afterClosed().subscribe(a => {
      if (a) {
        (a.id) ? this.updateActivity(a) : this.createActivity(a);
        this.ngOnInit();
        this.selectedMenu = null;
        this.selectedComponent = null;
        this.selectedActivity = null;
      }
    });
  }


  openComponentSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
       panelClass: [ 'fail_color']
    });
  }

  openActivitySnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
       panelClass: [ 'fail_color']
    });
  }
  selectMenu(menu) {
    this.selectedMenu = menu;
    this.selectedComponent = null;
    this.selectedActivity = null;
  }

  public selectComponent(component) {
    this.selectedComponent = component;
    this.selectedActivity = null;
  }
}

