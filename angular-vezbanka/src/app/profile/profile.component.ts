import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../shared/data/data.service';
import { Game, User } from '../shared/data/interfaces';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  id: string;
  user: User;
  games: Game[] = [];

  constructor(private dataService: DataService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.dataService.getProfile(Number(this.id))
        .subscribe((profile: User) => {
          this.user = profile;
          this.getGames();
        });
  }

  getGames() {
    this.dataService.getProfileGames(Number(this.id))
        .subscribe((list: Game[]) => {
          this.games = list;
        });
  }

}
