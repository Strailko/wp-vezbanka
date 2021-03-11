import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/data/data.service';
import { Game } from '../shared/data/interfaces';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  games: Game[] = [];
  filteredGames: Game[];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getGames()
        .subscribe((list: Game[]) => {
          this.games = this.filteredGames = list;
        });
  }

  searchGames(filterValue: string) {
    console.log(filterValue);
    if(filterValue) {
      this.dataService.searchGames(filterValue)
          .subscribe((list: Game[]) => {
            this.filteredGames = list;
          });
    }
    else {
      this.filteredGames = this.games;
    }
  }
}
