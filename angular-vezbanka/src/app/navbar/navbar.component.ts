import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../shared/auth/token-storage.service';
import { User } from '../shared/data/interfaces';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  loggedIn: boolean = false;
  userId: Number;

  constructor(private storage: TokenStorageService) { }

  ngOnInit(): void {
    if(this.storage.getToken()) {
      this.loggedIn = true;
      let user = this.storage.getUser()
      this.userId = user.id;
    }
  }

  logout() {
    this.storage.signOut();
  }
}
