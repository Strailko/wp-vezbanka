import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../shared/data/interfaces';
import { finalize, first } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthService } from '../shared/auth/auth.service';
import { DataService } from '../shared/data/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
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
    photo: '',
    biography: ''
  };

  constructor(
    private dataService: DataService,
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
  
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.authService.user$.subscribe((x) => {
      if (this.route.snapshot.url[0].path === 'login') {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        if (x && accessToken && refreshToken) {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
          if(returnUrl === '' || returnUrl === '/') {
            window.location.replace("/");
          }
          else {
            this.router.navigate([returnUrl]);
          }
        }
      }
    });
  }

  instantiateRegisterForm() {
    this.registerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl(''),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
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
    this.authService
      .login(this.username, this.password)
      .pipe(finalize(() => (this.busy = false)))
      .subscribe(
        (data) => {
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
    if (!this.registerUser.firstName || !this.registerUser.username || !this.registerUser.email || !this.registerUser.password || !this.registerUser.biography || !this.registerForm.valid) {
      this.registerError = true;
      return;
    }
    this.dataService.register(this.registerUser)
        .subscribe(
          (data) => {
              this.toggleRegistration();
              this.openSnackBar("Успешна регистрација!", "Во ред");
          },
          () => {
            this.registerError = true;
            this.openSnackBar("Неуспешна регистрација", "Обиди се повторно");
          }
        );
    this.registerForm.reset();
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
