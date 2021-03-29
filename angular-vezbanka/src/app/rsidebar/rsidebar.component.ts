import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../shared/auth/token-storage.service';
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

  constructor(private dataService: DataService, private storage: TokenStorageService) { }

  ngOnInit(): void {
    if(this.storage.getToken()) {
      this.loggedIn = true;
      let user = this.storage.getUser();
      this.userId = Number(user?.id);
      this.getGames();
    }
  }

  getGames() {
    if(this.userId) {
      this.dataService.getProfileGames(this.userId)
          .subscribe((list: Game[]) => {
            this.games = list;
          });
    }
  }


}
