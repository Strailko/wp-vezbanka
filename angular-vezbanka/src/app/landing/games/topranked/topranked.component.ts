import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { DataService } from 'src/app/shared/data/data.service';
import { Game } from 'src/app/shared/data/interfaces';

@Component({
  selector: 'app-topranked',
  templateUrl: './topranked.component.html',
  styleUrls: ['./topranked.component.scss']
})
export class ToprankedComponent implements OnInit {
  games: Game[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getTopRankedGames()
        .subscribe((list: Game[]) => {
          this.games = list;
        });
  }

}
