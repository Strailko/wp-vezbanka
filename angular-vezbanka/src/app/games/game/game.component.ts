import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  // heartGame(gameId: Number) {
  //   if(this.loggedIn) {
  //     this.heartedGame.gameId = gameId;
  //     this.heartedGame.userId = this.userId;
  //     this.dataService.heartGame(this.heartedGame)
  //         .subscribe((confirmation) => {
  //           console.log(confirmation);
  //         });
      
  //   }
  // }
}
