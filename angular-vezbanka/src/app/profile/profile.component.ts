import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from '../shared/auth/token-storage.service';
import { DataService } from '../shared/data/data.service';
import { Game, User } from '../shared/data/interfaces';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  loggedUserId: string;
  id: string;
  user: User;
  games: Game[] = [];
  showEditProfileButton: boolean = false;

  constructor(private dataService: DataService, private storage: TokenStorageService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if(!this.id) {
      this.id = this.storage.getUser().id;
    }
    this.dataService.getProfile(Number(this.id))
        .subscribe((profile: User) => {
          this.user = profile;
          this.getGames();
        });
    if(this.storage.getToken()) {
      console.log(this.storage.getUser())
      this.loggedUserId = this.storage.getUser().id;
      if(this.loggedUserId == this.id) {
        this.showEditProfileButton = true;
      }
    }
  }

  getGames() {
    this.dataService.getProfileGames(Number(this.id))
        .subscribe((list: Game[]) => {
          this.games = list;
        });
  }

}
