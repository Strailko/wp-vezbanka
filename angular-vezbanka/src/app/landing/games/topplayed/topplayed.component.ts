import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { DataService } from 'src/app/shared/data/data.service';
import { Game } from 'src/app/shared/data/interfaces';

@Component({
  selector: 'app-topplayed',
  templateUrl: './topplayed.component.html',
  styleUrls: ['./topplayed.component.scss']
})
export class TopplayedComponent implements OnInit {
  games: Game[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getTopPlayedGames()
        .subscribe((list: Game[]) => {
          this.games = list;
        });
  }
  
}
