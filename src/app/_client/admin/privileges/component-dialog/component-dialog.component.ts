import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { HttpClient } from '@angular/common/http';
import { PrivilegesService } from '../privileges.service';
import { Privilege } from '../privilege.model';

@Component({
  selector: 'app-component-dialog',
  templateUrl: './component-dialog.component.html',
  styleUrls: ['./component-dialog.component.scss']
})
export class ComponentDialogComponent implements OnInit {
  public form: FormGroup;

  // public icons = ['home', 'person', 'card_travel', 'delete', 'event', 'favorite', 'help'];

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    public dialogRef: MatDialogRef<ComponentDialogComponent>,
    public httpClient: HttpClient,
    @Inject(MAT_DIALOG_DATA) public privilege: Privilege,
    public fb: FormBuilder,
    public privilegesService: PrivilegesService
  ) {
    this.form = this.fb.group({
      id: null,
      title: null,
      name: [null, Validators.compose([Validators.required, Validators.minLength(4)])],
      // icon: null,
      link: null,
    });
  }

  ngOnInit() {
    if (this.privilege) {
      this.form.setValue(this.privilege);
    } else {
      this.privilege = new Privilege();
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  onSubmit(data) {
    // this.privilegesService.createComponent('xyz', this.form.value);
  }

}
