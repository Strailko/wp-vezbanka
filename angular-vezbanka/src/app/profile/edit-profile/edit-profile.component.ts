import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { TokenStorageService } from 'src/app/shared/auth/token-storage.service';
import { DataService } from 'src/app/shared/data/data.service';
import { User } from 'src/app/shared/data/interfaces';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  id: string;
  userId: Number;
  bgButton: boolean = false;
  bgLinks: boolean = false;
  bgUrl: boolean = false;
  fileName: string;
  locked: boolean = false;
  user: User;
  editForm: FormGroup;
  error = false;

  constructor(private dataService: DataService ,private authService: AuthService, private snackBar: MatSnackBar, private storage: TokenStorageService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.instantiateForm();
    this.id = this.route.snapshot.paramMap.get('id');
    let usr = this.storage.getUser();
    this.userId = usr.id;
    if(this.id) {
      if(Number(this.id) == this.userId || usr.roles.includes("MODERATOR") || usr.roles.includes("ADMIN")) {
        this.dataService.getProfile(Number(this.id))
            .subscribe((profile: User) => {
              this.user = profile;
              this.user.password = '';
            }, () => {
              this.router.navigate(["/profile"]);
            });
      }
      else {
        this.router.navigate(["/profile/"+this.id]);
      }
    }
  }

  instantiateForm() {
    this.editForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl(''),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      biography: new FormControl('', [Validators.required]),
    });
  }

  finishEditing() {
    if (!this.user.firstName || !this.user.username || !this.user.photo || !this.user.email || !this.user.password || !this.user.biography) {
      this.error = true;
      return;
    }
    this.authService.register(this.user)
        .subscribe(
          () => {
              this.openSnackBar("Успешни измени!", "Во ред");
              this.router.navigate(['/profile']);
          },
          () => {
            this.error = true;
            this.openSnackBar("Неуспешни измени", "Обиди се повторно");
          }
        );
    this.editForm.reset();
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
          this.user.photo = e.target.result;
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
