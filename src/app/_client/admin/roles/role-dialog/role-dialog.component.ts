import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Injectable, ViewChild, ElementRef, AfterViewInit, Inject, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrivilegesService } from '../../privileges/privileges.service';
import { ClientService } from '../../../client.service';

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
  selector: 'app-role-dialog',
  templateUrl: './role-dialog.component.html',
  styleUrls: ['./role-dialog.component.scss'],
  providers: [ChecklistDatabase]
})

export class RoleDialogComponent implements OnInit, AfterViewInit {
  public form: FormGroup;
  selectionView = 'list'; // or list / tree

  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();
  selectedParent: TodoItemFlatNode | null = null;

  privileges;
  checkedTreeData = [];
  checkedListData = [];
  isChecked = false;

  @ViewChild('selection', { static: false }) menuPrivilegesSelection: ElementRef<any>;

  newItemName = '';
  treeControl: FlatTreeControl<TodoItemFlatNode>;
  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;
  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);
  userPrivileges;

  constructor(
    public dialogRef: MatDialogRef<RoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _database: ChecklistDatabase,
    public fb: FormBuilder,
    private appService: ClientService,
    private privilegesService: PrivilegesService,

  ) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    this._database.dataChange.next(this._database.buildFileTree(data.privilegeTree, 0));


    _database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });

    this.form = this.fb.group({
      title: null,
      privileges: new FormControl(this.privileges),
    });
  }

  ngOnInit() {
    if (this.data.role) {
      this.form.setValue(this.data.role);
    } else {
    }
    if(this.selectionView === 'list') {
      this.checkedListData = this.data.privileges;
    }
  }

  ngAfterViewInit(): void {
  }

  getLevel = (node: TodoItemFlatNode) => node.level;
  isExpandable = (node: TodoItemFlatNode) => node.expandable;
  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;
  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;
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
    return descAllSelected;
  }

  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
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
      this.checkedTreeData.push(node);
      return node;
    } else {
      node.parent = this.getParentNode(node);
      if (node.level === 2) {
        this.checkedTreeData.push(node);
      }
      this.getCheckedTreeItems(this.getParentNode(node));
    }
  }

  getSelectedPrivileges() {
    let privileges = {};
    this.checkedTreeData.forEach(data => {
      const menu = data && data.parent && data.parent.parent && data.parent.parent.item? data.parent.parent.item: null;
      const component = data && data.parent && data.parent.item ? data.parent.item: null;
      const activity = data && data.item ? data.item : null;

      if(menu) {
        if (privileges[menu] === undefined) privileges[menu] = {};
        if(component) {
          if (privileges[menu][component] === undefined) privileges[menu][component] = {};
          if(activity) {
            privileges[menu][component][activity] = true;
          }
        }
      }

      if(this.selectionView === 'list') {
        privileges[activity] = true;
      }
    });
    if (Object.keys(privileges).length === 0) {
      this.privileges = null;
    }
    this.form.patchValue({
      privileges: {
        menus: privileges
      },
    });

    const menus = [];
    for (let m in privileges) {
      const components = [];
      for (const c in privileges[m]) {
        const activities = Object.keys(privileges[m][c]);
        components.push({ name: c, activities });
      }
      menus.push({ name: m, components });
    }
    this.privileges = {
      menus,
    };
    // this.form.patchValue({
    //   privileges: this.privileges,
    // })
  }

  addNewItem(node: TodoItemFlatNode) {
    const parentNode = this.flatNodeMap.get(node);
    this._database.insertItem(parentNode!, '');
    this.treeControl.expand(node);
  }

  saveNode(node: TodoItemFlatNode, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node);
    this._database.updateItem(nestedNode!, itemValue);
  }

  close(): void {
    this.dialogRef.close();
  }
}
