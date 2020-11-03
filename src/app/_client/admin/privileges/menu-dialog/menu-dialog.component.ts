import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { HttpClient } from '@angular/common/http';
// import { User } from '../../users/user.model';
import { PrivilegesService } from '../privileges.service';
import { element } from 'protractor';

@Component({
  selector: 'app-menu-dialog',
  templateUrl: './menu-dialog.component.html',
  styleUrls: ['./menu-dialog.component.scss']
})
export class MenuDialogComponent implements OnInit {
  public form: FormGroup;

  // public icons = ['home', 'person', 'card_travel', 'delete', 'event', 'favorite', 'help'];
  public icons =[];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  menuRoutes: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<MenuDialogComponent>,
    public httpClient: HttpClient,
    @Inject(MAT_DIALOG_DATA) public user: any,
    public fb: FormBuilder,
    public privilegesService: PrivilegesService,
  ) {
    this.form = this.fb.group({
      id: null,
      title: null,
      //icon: null,
      name: [null, Validators.compose([Validators.required, Validators.minLength(4)])],
      route: this.fb.group({
        name: null,
        link: null,
        href: null,
        target: null,
        // isActive: null
      }),
    });
  }

  ngOnInit() {
    // for (const key in menuItems) {
    //   if (menuItems.hasOwnProperty(key)) {
    //     const element = menuItems[key];
    //     element.forEach(menu => {
    //       this.menuRoutes.push(menu.routerLink);
    //     });
    //   }
    // }
    this.getIcons();
    if (this.user) {
      this.form.setValue(this.user);
    } else {
      // this.user = new any(null);
    }

  }

  getIcons(){
    this.httpClient.get('assets/icon.json').subscribe(data =>{
      let category = data['categories'];
      category.forEach(element => {
        element.icons.forEach(key => {
          this.icons.push(key.ligature);
        });
      });
      this.icons = this.icons.sort();
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  onSubmit(data) {
    this.privilegesService.createMenu(this.form.value);
  }
}
