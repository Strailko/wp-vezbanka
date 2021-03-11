import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, Validators, FormBuilder }  from '@angular/forms';
import { User } from 'src/app/shared/data/interfaces';

@Component({
  selector: 'app-register-dialog',
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.scss']
})
export class RegisterDialogComponent implements OnInit {
  user: User;
  //form: FormGroup;

  constructor(private dialogRef: MatDialogRef<RegisterDialogComponent>, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    // this.form = this.formBuilder.group({
    //   name: ['', [Validators.required]],
    //   price: ['', [Validators.required, Validators.min(0)]],
    // });
  }
  save() {
    //this.user = this.form.value;
    //this.form.reset();
    this.dialogRef.close(this.user);
  }

  close() {
    this.dialogRef.close();
  }
}
