import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth/auth.service';
import { User } from '../shared/data/interfaces';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  loggedIn: boolean = false;
  userId: Number;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    if(localStorage.getItem('access_token')) {
      this.loggedIn = true;
      this.authService.getUser()
          .subscribe(login => {
            this.userId = login.user.id;
          });
    }
  }

  logout() {
    this.authService.logout();
  }
}
