import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from '../shared/auth/token-storage.service';
import { DataService } from '../shared/data/data.service';
import { Category, Game, User } from '../shared/data/interfaces';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {
  id: string;
  type: string;
  user: User;
  games: Game[] = [];
  loggedIn: boolean = false;
  userId: Number;
  title: string = 'Игри';
  subtitle: string = 'Листа на игри';

  constructor(private dataService: DataService, private storage: TokenStorageService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.type = this.route.snapshot.paramMap.get('type');
    if(this.type === 'topplayed') {
      this.dataService.getTopPlayedGames()
          .subscribe((list: Game[]) => {
            this.games = list;
            this.title = 'Најиграни';
            this.subtitle = 'Листа на најиграни игри';
          });
    }
    else if(this.type === 'toprated') {
      this.dataService.getTopRankedGames()
          .subscribe((list: Game[]) => {
            this.games = list;
            this.title = 'Најомилени';
            this.subtitle = 'Листа на најомилени игри';
          });
    }
    else if(this.type === 'latest') {
      this.dataService.getLatestGames()
          .subscribe((list: Game[]) => {
            this.games = list;
            this.title = 'Нови';
            this.subtitle = 'Листа на нови игри';
          });
    }
    else if(this.type === 'category') {
      this.id = this.route.snapshot.paramMap.get('id');
      console.log('category ' + this.id);
      if(this.id) {
        this.dataService.getCategory(Number(this.id))
            .subscribe((cat: Category) => {
              this.games = cat.games;
              this.title = cat.name;
              this.subtitle = 'Листа на игри од категорија ' + cat.name;
            });
      }    
      else {
        this.router.navigate(['/games']);
      }
    }
    else if(this.type === 'favorite') {
      if(this.storage.getToken()) {
        this.loggedIn = true;
        let user = this.storage.getUser();
        this.userId = Number(user?.id);
        this.getFavGames();
      }
      else {
        this.router.navigate(['/games']);
      }
    }
    else {
      this.dataService.getGames()
          .subscribe((list: Game[]) => {
            this.games = list;
          });
    }
  }

  getFavGames() {
    if(this.userId) {
      this.dataService.getProfileFavoriteGames(this.userId)
          .subscribe((list: Game[]) => {
            this.games = list;
            this.title = 'Твои омилени';
            this.subtitle = 'Листа на твои омилени игри';
          });
    }
  }

}
