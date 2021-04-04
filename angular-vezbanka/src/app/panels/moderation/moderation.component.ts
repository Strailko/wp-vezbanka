import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/data/data.service';
import { Game } from 'src/app/shared/data/interfaces';

@Component({
  selector: 'app-moderation',
  templateUrl: './moderation.component.html',
  styleUrls: ['./moderation.component.scss']
})
export class ModerationComponent implements OnInit {
  games: Game[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getGames()
    .subscribe((list: Game[]) => {
      this.games = list;
    });
  }

}
