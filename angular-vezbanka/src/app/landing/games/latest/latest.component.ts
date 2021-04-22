import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { DataService } from 'src/app/shared/data/data.service';
import { Category, Game } from 'src/app/shared/data/interfaces';

@Component({
  selector: 'app-latest',
  templateUrl: './latest.component.html',
  styleUrls: ['./latest.component.scss']
})
export class LatestComponent implements OnInit {
  games: Game[] = [];
  categories: Category[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getLatestGames()
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
