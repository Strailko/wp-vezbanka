import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../shared/data/interfaces';
import { finalize, first } from 'rxjs/operators';
import { TokenStorageService } from '../shared/auth/token-storage.service';
import { DataService } from '../shared/data/data.service';
import { AuthService } from '../shared/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  busy = false;
  showRegister: boolean = false;
  username = '';
  password = '';
  loginError = false;
  registerError = false;
  loginForm: FormGroup;
  registerForm: FormGroup;
  registerUser: User = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    photo: '../../../assets/img/demo/u1.png',
    biography: ''
  };
  bgButton: boolean = false;
  bgLinks: boolean = false;
  bgUrl: boolean = false;
  fileName: string;
  locked: boolean = false;
  repeatPassword: string = '';

  constructor(
    private dataService: DataService,
    private storage: TokenStorageService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
    this.instantiateRegisterForm();
  }


  ngOnInit(): void {
    if(this.route.snapshot.url[0].path == "register") {
      this.showRegister = !this.showRegister;
    }
    if (this.route.snapshot.url[0].path === 'login') {
      if (this.storage.getToken()) {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
        if(returnUrl === '' || returnUrl === '/') {
          window.location.replace("/");
        }
        else {
          this.router.navigate([returnUrl]);
        }
      }
    }
  }

  instantiateRegisterForm() {
    this.registerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl(''),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      repeatPassword: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      biography: new FormControl('', [Validators.required]),
    });
  }

  toggleRegistration() {
    if(this.showRegister == false) {
      this.loginError = false;
    }
    else {
      this.registerError = false;
    }
    this.showRegister = !this.showRegister;
  }


  login() {
    if (!this.username || !this.password || !this.loginForm.valid) {
      this.loginError = true;
      return;
    }
    this.busy = true;
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
    let credentials = {
      username: this.username,
      password: this.password
    }
    this.authService
      .login(credentials)
      .pipe(finalize(() => (this.busy = false)))
      .subscribe(
        data => {
          this.storage.saveToken(data.token);
          this.storage.saveUser(data);
          window.location.replace("/");
        },
        () => {
          this.loginError = true;
          this.openSnackBar("Неуспешна најава", "Обиди се повторно");
        }
      );
    this.loginForm.reset();
  }

  register() {
    if (!this.registerUser.firstName || !this.registerUser.username || !this.registerUser.photo || !this.registerUser.email || !this.registerUser.password || !this.registerUser.biography) {
      this.registerError = true;
      this.openSnackBar("Празно поле, нецелосни податоци", "Дополни");
      return;
    }
    if(!this.registerForm.valid) {
      this.registerError = true;
      this.openSnackBar("Невалидна email адреса", "Обиди се повторно");
      return;
    }
    if(this.registerUser.password != this.repeatPassword) {
      this.registerError = true;
      this.openSnackBar("Лозинките не се совпаѓаат", "Обиди се повторно");
      return;
    }
    this.authService.register(this.registerUser)
        .subscribe(
          () => {
              this.toggleRegistration();
              this.openSnackBar("Успешна регистрација!", "Во ред");
          },
          () => {
            this.registerError = true;
            this.openSnackBar("Неуспешна регистрација, корисничкото име веќе постои", "Обиди се повторно");
          }
        );
    this.registerForm.reset();
  }

  bgEnter() {
    this.bgButton = true;
  }

  bgLeave(answer?: any) {
    if(!this.locked) {
      this.bgUrl = false;
      this.bgLinks = false;
      this.bgButton = false;
      if(answer) {
        answer.bgButton1 = false;
        answer.bgButton2 = false;
      }
    }
  }

  fileSelected(event: any) {
    const file:File = event.target.files[0];
    if (file) {
        this.fileName = file.name;
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (e:any) => {
          this.registerUser.photo = e.target.result;
          this.locked = false;
          this.bgLeave();
        }
    }
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
