import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/data/data.service';
import { Category, Game } from '../shared/data/interfaces';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  games: Game[] = [];
  filteredGames: Game[];
  categories: Category[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getTopPlayedGames()
        .subscribe((list: Game[]) => {
          this.dataService.getCategories()
              .subscribe((cats) => {
                this.categories = cats;
                list.forEach((game) => game.categories = this.categories.filter(cat => game.categoryIds.includes(cat.id)));
                this.games = this.filteredGames = list;
              });
        });
  }

  searchGames(filterValue: string) {
    if(filterValue) {
      this.dataService.searchGames(filterValue)
          .subscribe((list: Game[]) => {
            this.dataService.getCategories()
                .subscribe((cats) => {
                  this.categories = cats;
                  list.forEach((game) => game.categories = this.categories.filter(cat => game.categoryIds.includes(cat.id)));
                  this.filteredGames = list;
                });
          });
    }
    else {
      this.filteredGames = this.games;
    }
  }

  routeToGame(id) {
    window.location.replace("/game/"+id);
  }
}
