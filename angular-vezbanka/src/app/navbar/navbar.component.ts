import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../shared/auth/token-storage.service';
import { DataService } from '../shared/data/data.service';
import { User } from '../shared/data/interfaces';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isMod: boolean = false;
  loggedIn: boolean = false;
  userId: Number;
  userPhoto: string = '../../../assets/img/demo/u1.png';

  constructor(private storage: TokenStorageService, private dataService: DataService) { }

  ngOnInit(): void {
    if(this.storage.getToken()) {
      this.loggedIn = true;
      let user = this.storage.getUser();
      this.userId = user.id;
      this.dataService.getProfile(this.userId)
          .subscribe((profile: User) => {
            this.userPhoto = profile.photo;
          });
      if(user.roles.includes("MODERATOR") || user.roles.includes("ADMIN")) {
        this.isMod = true;
      }
    }
  }

  logout() {
    this.storage.signOut();
    window.location.replace("/");
  }
}
