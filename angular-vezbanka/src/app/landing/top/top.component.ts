import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/shared/data/data.service';
import { Game } from 'src/app/shared/data/interfaces';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss']
})
export class TopComponent implements OnInit {

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
  }

  randomGame() {
    this.dataService.getRandomGameId()
        .subscribe((game) => {
          if(game) {
            this.router.navigate(['/game/' + game.id]);
          }
        });
  }
}
