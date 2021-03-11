import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth/auth.service';
import { DataService } from '../shared/data/data.service';
import { Game } from '../shared/data/interfaces';

@Component({
  selector: 'app-rsidebar',
  templateUrl: './rsidebar.component.html',
  styleUrls: ['./rsidebar.component.scss']
})
export class RsidebarComponent implements OnInit {
  games: Game[] = [];
  loggedIn: boolean = false;
  userId: Number;

  constructor(private dataService: DataService, private authService: AuthService) { }

  ngOnInit(): void {
    if(localStorage.getItem('access_token')) {
      this.loggedIn = true;
      this.authService.getUser()
          .subscribe(login => {
            this.userId = login.user.id;
            this.getGames();
          });
    }
  }

  getGames() {
    this.dataService.getProfileGames(this.userId)
        .subscribe((list: Game[]) => {
          this.games = list;
        });
  }


}
