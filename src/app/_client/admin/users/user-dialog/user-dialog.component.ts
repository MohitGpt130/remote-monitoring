import { Component, OnInit, Inject, Input, Output, EventEmitter, ElementRef, ViewChild, Injectable } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User, UserProfile, UserWork, UserContacts, UserSocial, UserSettings } from '../user.model';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import {
  HttpClient,
  HttpResponse,
  HttpRequest,
  HttpEventType,
  HttpErrorResponse
} from '@angular/common/http';
import { Subscription, of, Observable, BehaviorSubject } from 'rxjs';
import { catchError, last, map, tap, startWith } from 'rxjs/operators';
import { FlatTreeControl } from '@angular/cdk/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { RolesService } from '../../roles/roles.service';
import { PrivilegesService } from '../../privileges/privileges.service';

export class TodoItemNode {
  children: TodoItemNode[];
  item: string;
}

export class TodoItemFlatNode {
  item: string;
  level: number;
  expandable: boolean;
}

const TREE_DATA = {};

@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);

  get data(): TodoItemNode[] { return this.dataChange.value; }

  constructor() {
    this.initialize();
  }

  initialize() {
    const data = this.buildFileTree(TREE_DATA, 0);
    this.dataChange.next(data);
  }

  buildFileTree(obj: { [key: string]: any }, level: number): TodoItemNode[] {

    return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TodoItemNode();
      node.item = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.item = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  insertItem(parent: TodoItemNode, name: string) {
    if (parent.children) {
      parent.children.push({ item: name } as TodoItemNode);
      this.dataChange.next(this.data);
    }
  }

  updateItem(node: TodoItemNode, name: string) {
    node.item = name;
    this.dataChange.next(this.data);
  }
}
@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 100 })),
      transition('* => void', [animate(300, style({ opacity: 0 }))])
    ])
  ],
  providers: [ChecklistDatabase],
})

export class UserDialogComponent implements OnInit {
  public form: FormGroup;
  public passwordHide = true;
  @Output() completeEE = new EventEmitter<string>();

  private files: Array<FileUploadModel> = [];

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  roleCtrl = new FormControl(null, Validators.required);
  homeRouteCtrl = new FormControl(null, Validators.required);
  routes;
  filteredRoles: Observable<string[]>;
  selectedRoles: string[] = [];
  newuserIsActive = true;


  @ViewChild('roleInput', { static: false }) roleInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();
  selectedParent: TodoItemFlatNode | null = null;

  privileges = {};
  checkedTreeData = [];

  @ViewChild('selection', { static: false }) menuPrivilegesSelection: ElementRef<any>;
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef<any>;

  roles = [];

  srcResult = '';

  newItemName = '';
  treeControl: FlatTreeControl<TodoItemFlatNode>;
  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;
  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);
  user;
  userPrivileges;
  isFormIsValid = false;

  constructor(
    // tslint:disable-next-line: variable-name
    private _database: ChecklistDatabase,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    public httpClient: HttpClient,
    public rolesService: RolesService,
    public fb: FormBuilder,
    private privilegesService: PrivilegesService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.user = this.data.user;
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.data.privileges={}
    this._database.dataChange.next(this._database.buildFileTree(data.privileges, 0));

    // this.rolesService.getRoles().subscribe(roles => {
    //   this.roles = roles;
    // });

    // this.routes = [
    //   {
    //     name: 'admin',
    //     link: '/admin'
    //   },
    //   {
    //     name: 'AVOD',
    //     link: '/avod'
    //   },
    // ];

    // tslint:disable-next-line: no-shadowed-variable
    _database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
    this.form = this.fb.group({
      // name: [null, Validators.compose([Validators.required, Validators.minLength(4)])],
      fullName: [null, Validators.compose([Validators.required])],
      // name: null,
      email:  [
        null,
        Validators.compose([Validators.required, Validators.email])
      ],
      code: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required , Validators.minLength(6)])],
      roles:  this.roleCtrl,
      // profile: this.fb.group({
      //   firstName: [null, Validators.compose([Validators.required])],
      //   lastName: [null, Validators.compose([Validators.required])],
      //   middleName: null,
      //   birthDate: [null, Validators.compose([Validators.required])],
      //   gender: new FormControl('male'),
      //   // nationality: [null, Validators.compose([Validators.required])],
      //   maritalStatus: new FormControl('unmarried'),
      //   image: null,
      // }),
      // contacts: this.fb.group({
      //   alternateEmail: null,
      //   phone: new FormControl([null, Validators.compose([Validators.required , Validators.minLength(10),Validators.maxLength(10)])]),
      //   address: null
      // }),
      privileges: null,
      isActive: new FormControl(true),
      // registrationDate: [null, Validators.compose([Validators.required])],
      joinedDate: [null, Validators.compose([Validators.required])],
      homeRoute: this.homeRouteCtrl,
      uploadFile: null,
    });
  }

  selctedRole(event) {
    const userSelectedRolePrivileges = this.roles.filter(r => r._id === event.value)[0].privileges;
    this.routes = [];
    this.privilegesService.getPrivileges().subscribe(p => {
      this.userPrivileges = p;
      if(userSelectedRolePrivileges && userSelectedRolePrivileges.menus ) {
        Object.keys(userSelectedRolePrivileges.menus).forEach(route => {
            this.routes.push({name: route, link: this.userPrivileges.filter(p => p.name === route)[0].route.link})
        });
      } else {
          this.userPrivileges = p;
          this.userPrivileges.forEach(p => {
            this.routes.push({name: p.name, link: p.route.link})
          });
      }
    });
  }

  ngOnInit() {
    this.roles = this.data.roles;
    // if (this.data.user) {
    //   const roles = [];
    //   if (!this.user['roles']) {
    //     this.user['roles'].forEach(role => roles.push(role.name));
    //   }
    //   this.user = new User(this.user);
    //   // this.user.privileges = new FormControl(this.privileges);
    //   this.user['uploadFile'] = null;
    //   this.user['password'] = '';
    //   this.user['roles'] = new FormControl(roles[0]);
    //   this.user['privilegesAccess'] = null;
    //   this.user.profile.image = null;
    //   this.user.contacts = {
    //     email: null,
    //     phone: null,
    //     address: null
    //   };
    //   // this.user.social = {
    //   //   facebook: null,
    //   //   twitter: null,
    //   //   google: null
    //   // };
    //   this.form.setValue(this.user);
    // } else {
    //   this.user = new User();
    // }
  }

  close(): void {
    this.dialogRef.close();
  }

  private removeFileFromArray(file: FileUploadModel) {
    const index = this.files.indexOf(file);
    if (index > -1) {
      this.files.splice(index, 1);
    }
  }

  getLevel = (node: TodoItemFlatNode) => node.level;
  isExpandable = (node: TodoItemFlatNode) => node.expandable;
  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;
  // tslint:disable-next-line: variable-name
  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;
  // tslint:disable-next-line: variable-name
  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === '';

  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
      ? existingNode
      : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    this.checkAllParentsSelection(node);
    // this.checklistSelection.selected.forEach(elm => {
    //   this.getCheckedTreeItems(elm);
    //   this.getSelectedPrivileges();
    // });
    return descAllSelected;
  }

  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    // this.checklistSelection.selected.forEach(elm => {
    //   this.getCheckedTreeItems(elm);
    //   this.getSelectedPrivileges();
    // });
    return result && !this.descendantsAllSelected(node);
  }

  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    this.checkedTreeData = [];
    this.checklistSelection.selected.forEach(elm => {
      this.getCheckedTreeItems(elm);
      this.getSelectedPrivileges();
    });
  }

  todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
    this.checkedTreeData = [];
    this.checklistSelection.selected.forEach(elm => {
      this.getCheckedTreeItems(elm);
      this.getSelectedPrivileges();
    });
  }

  checkAllParentsSelection(node: TodoItemFlatNode): void {
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
    // this.checklistSelection.selected.forEach(elm => {
    //   this.getCheckedTreeItems(elm);
    //   this.getSelectedPrivileges();
    // });
  }

  checkRootNodeSelection(node: TodoItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
    // this.checklistSelection.selected.forEach(elm => {
    //   this.getCheckedTreeItems(elm);
    //   this.getSelectedPrivileges();
    // });
  }

  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
    const currentLevel = this.getLevel(node);
    if (currentLevel < 1) {
      return null;
    }
    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];
      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  getCheckedTreeItems(node) {
    if (this.getParentNode(node) === null || this.getParentNode(node) === undefined) {
      return node;
    } else {
      node.parent = this.getParentNode(node);
      if (node.level === 7) {
        this.checkedTreeData.push(node);
      }
      this.getCheckedTreeItems(this.getParentNode(node));
    }
  }

  getSelectedPrivileges() {
    const privileges = {};
    this.checkedTreeData.forEach(data => {
      const company =   data.parent.parent.parent.parent.parent.parent.parent.item;
      const country =   data.parent.parent.parent.parent.parent.parent.item;
      const countryState =  data.parent.parent.parent.parent.parent.item;
      const location =     data.parent.parent.parent.parent.item;
      const plant =     data.parent.parent.parent.item;
      const line =      data.parent.parent.item;
      const machines =  data.parent.item;
      const machine =   data.item;

      if (privileges[company] === undefined) { privileges[company] = {}; }
      if (privileges[company][country] === undefined) {privileges[company][country] = {}; }
      if (privileges[company][country][countryState] === undefined) { privileges[company][country][countryState] = {}; }
      if (privileges[company][country][countryState][location] === undefined) { privileges[company][country][countryState][location] = {}; }
      if (privileges[company][country][countryState][location][plant] === undefined) { privileges[company][country][countryState][location][plant] = {}; }
      if (privileges[company][country][countryState][location][plant][line] === undefined) { privileges[company][country][countryState][location][plant][line] = {}; }
      if (privileges[company][country][countryState][location][plant][line][machines] === undefined) { privileges[company][country][countryState][location][plant][line][machines] = {}; }
      if (privileges[company][country][countryState][location][plant][line][machines][machine] === undefined) { privileges[company][country][countryState][location][plant][line][machines][machine] = true; }
    });

    this.form.patchValue({
      privileges,
    });

    // const menus = [];
    // for (let m in privileges) {
    //   const components = [];
    //   for (let c in privileges[m]) {
    //     const activities = Object.keys(privileges[m][c])
    //     components.push({ name: c, activities })
    //   }
    //   menus.push({ name: m, components })
    // }
    // this.privileges = {
    //   menus,
    // };
    // this.form.patchValue({
    //   privileges: this.privileges,
    // })
  }

  addNewItem(node: TodoItemFlatNode) {
    const parentNode = this.flatNodeMap.get(node);
    // tslint:disable-next-line: no-non-null-assertion
    this._database.insertItem(parentNode!, '');
    this.treeControl.expand(node);
  }

  saveNode(node: TodoItemFlatNode, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node);
    // tslint:disable-next-line: no-non-null-assertion
    this._database.updateItem(nestedNode!, itemValue);
  }

  onFileSelected(eventTarget) {
    this.form.patchValue({
      uploadFile: eventTarget.files[0]
    });
  }
}

export class FileUploadModel {
  data: File;
  state: string;
  inProgress: boolean;
  progress: number;
  canRetry: boolean;
  canCancel: boolean;
  sub?: Subscription;
}
