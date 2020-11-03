import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { MatDialog } from '@angular/material/dialog';
import { RoleDialogComponent } from './role-dialog/role-dialog.component';
import { Role, Activity } from './role.model';
import { AuthService } from '../../auth/auth.service';
import { RolesService } from './roles.service';
import { ClientService, } from '../../client.service';
import { PrivilegesService } from '../privileges/privileges.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppSettings } from '../../app.settings';

interface MenuNode {
  name: string;
  title?: string;
  children?: MenuNode[];
}

interface RoleNode {
  name: string;
  title: string;
  treeNodes: MatTreeNestedDataSource<MenuNode>;
}

const TREE_DATA: MenuNode[] = [];

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [RolesService]
})
export class RolesComponent implements OnInit {
  public currentUser;
  public currentUserRole;
  public currentUserPrivilege;

  selectionView = 'list'; // or list / tree

  viewType;
  public roles: any;
  public searchText: string;
  public page: any;
  public settings: any;

  private privilegeTree;
  privileges;

  gridView = true;
  apiConfigs;

  treeControl = new NestedTreeControl<MenuNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<MenuNode>();
  roleTreeNodes = {};

  hasChild = (_: number, node: MenuNode) => !!node.children && node.children.length > 0;

  constructor(
    public appSettings: AppSettings,
    public appService: ClientService,
    public dialog: MatDialog,
    public rolesService: RolesService,
    public authService: AuthService,
    public privilegesService: PrivilegesService,
    public snackBar: MatSnackBar,

  ) {
    this.dataSource.data = TREE_DATA;
    this.settings = this.appSettings.settings;
    this.authService.currentUser.subscribe(x => {
      this.currentUser = x;
    });
    // this.authService.currentUserPrivileges.subscribe(x => x[0] && x[0].privileges && x[0].privileges.menus && x[0].privileges.menus.AdminRoles ? this.currentUserPrivilege = x[0].privileges.menus.AdminRoles : {});
  }

  ngOnInit() {
    // this.appService.getAPIConfigs().subscribe((data: any) => this.apiConfigs = data);
    this.getPrivileges();
    this.getRoles();
  }

  async getRoles() {
    this.roles = null;
    return this.rolesService.getRoles().subscribe(roles => {
      // this.roles = roles;
      this.roles = roles.filter(role => (role.name !== 'user' && role.name !== 'admin'));

      roles.forEach((role: any) => {
        const roleNode: RoleNode = {
          name: role.name,
          title: role.title,
          treeNodes: new MatTreeNestedDataSource<MenuNode>(),
        };

        const menus = [];
        if(this.selectionView === 'tree') {
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
        }


        if(this.selectionView === 'list') {
          const menus = [];
          if (role && role.privileges && role.privileges.menus) {
            for (const m in role.privileges.menus) {
              // menus.push({ name: m, children: [] });
              menus.push(this.privileges.filter(p => p.name == m)[0]);
            }
          }
          this.roleTreeNodes[role.name] = menus;
        }
      });
    });
  }

  getPrivileges() {
    this.privilegesService.getPrivileges().subscribe((privileges) => {
      this.privileges = privileges;
      const privilegeTree = {};

      privileges.forEach(privilege => {
        if (!privilegeTree[privilege.route.name]) {
          privilegeTree[privilege.route.name] = null;
        }
        // if (privilege.route.components.length === 0) {
        //   delete privilegeTree[privilege.route.name];
        // }
        // privilege.route.components.forEach(component => {
        //   if (!privilegeTree[privilege.route.name][component.name]) {
        //     privilegeTree[privilege.route.name][component.name] = {};
        //   }
        //   if (component.activities.length === 0) {
        //     delete privilegeTree[privilege.route.name];
        //   }
        //   component.activities.forEach(activity => {
        //     if (!privilegeTree[privilege.route.name][component.name][activity.name]) {
        //       privilegeTree[privilege.route.name][component.name][activity.name] = null;
        //     }
        //   });
        // });
      });
      this.privilegeTree = privilegeTree;
    });
  }

  public addRole(role: any) {
    this.rolesService.addRole(role).subscribe(r => {
      this.snackBar.open('Role Created Successfully', '', { duration: 3000 });
      this.getRoles();
  }, err => {

    this.snackBar.open('Failed to create the Role', '', { duration: 3000, panelClass: [ 'fail_color']});
  });
  }
  public updateRole(role: Role) {
    this.rolesService.updateRole(role).subscribe(r => {
      this.snackBar.open('Role Updated Successfully', '', { duration: 3000 });
      this.getRoles();
  }, err => {

    this.snackBar.open('Failed to update the Role', '', { duration: 3000, panelClass: [ 'fail_color']});
  });
  }
  public deleteRole(role: Role) {
    this.rolesService.deleteRole(role.name).subscribe(r => {
      this.snackBar.open('Role Deleted Successfully', '', { duration: 3000 });
      this.getRoles();
  }, err => {

    this.snackBar.open('Failed to delete the Role', '', { duration: 3000, panelClass: [ 'fail_color']});
  });
  }

  public onPageChanged(event) {
    this.page = event;
    this.getRoles();
    if (this.settings.fixedHeader) {
      document.getElementById('main-content').scrollTop = 0;
    } else {
      document.getElementsByClassName('mat-drawer-content')[0].scrollTop = 0;
    }
  }

  public openRoleDialog(role) {
    if(this.privilegeTree) {
      const dialogRef = this.dialog.open(RoleDialogComponent, {
        data: { role, privilegeTree: this.privilegeTree, privileges: this.privileges }
      });
      dialogRef.afterClosed().subscribe(r => {
        if (r) {
          (r.id) ? this.updateRole(r) : this.addRole(r);
        }
      });
    }
  }
}
