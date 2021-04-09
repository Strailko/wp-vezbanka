import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/data/data.service';
import { Category, Game } from 'src/app/shared/data/interfaces';

@Component({
  selector: 'app-moderation',
  templateUrl: './moderation.component.html',
  styleUrls: ['./moderation.component.scss']
})
export class ModerationComponent implements OnInit {
  games: Game[] = [];
  categories: Category[] = [];
  toggleCategories: boolean = false;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getGames()
    .subscribe((list: Game[]) => {
      this.dataService.getCategories()
          .subscribe((cats) => {
            this.categories = cats;
            list.forEach((game) => game.categories = this.categories.filter(cat => game.categoryIds.includes(cat.id)));
            this.games = list;
          });
    });
  }

}
