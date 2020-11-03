import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { HttpClient } from '@angular/common/http';
import { PrivilegeComponentActivity } from '../privilege.model';

@Component({
  selector: 'app-activity-dialog',
  templateUrl: './activity-dialog.component.html',
  styleUrls: ['./activity-dialog.component.scss']
})
export class ActivityDialogComponent implements OnInit {
  public form: FormGroup;

  // public icons = ['home', 'person', 'card_travel', 'delete', 'event', 'favorite', 'help'];

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    public dialogRef: MatDialogRef<ActivityDialogComponent>,
    public httpClient: HttpClient,
    @Inject(MAT_DIALOG_DATA) public activity: PrivilegeComponentActivity,
    public fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      id: null,
      title: null,
      name: [null, Validators.compose([Validators.required, Validators.minLength(4)])],
    });
  }

  ngOnInit() {
    if (this.activity) {
      this.form.setValue(this.activity);
    } else {
      this.activity = new PrivilegeComponentActivity();
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  onSubmit(data) {
    // this.menusService.createComponent('xyz', this.form.value);
  }

}
