import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from 'src/app/shared/auth/token-storage.service';
import { DataService } from 'src/app/shared/data/data.service';
import { Game, HeartedGame, User } from 'src/app/shared/data/interfaces';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  isMod: boolean = false;
  id: string;
  game: Game;
  loggedIn: boolean = false;
  user: User;
  heartedGame: HeartedGame = {
    gameId: 0,
    userId: 0
  };

  constructor(private snackBar: MatSnackBar, private dataService: DataService, private storage: TokenStorageService, private router: Router, private route: ActivatedRoute, private clipboard: Clipboard) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.dataService.getGame(Number(this.id))
        .subscribe((data: Game) => {
          this.game = data;
        });
    if(this.storage.getToken()) {
      this.loggedIn = true;
      this.user = this.storage.getUser();
      if(this.storage.getUser().roles.includes("MODERATOR") || this.storage.getUser().roles.includes("ADMIN")) {
        this.isMod = true;
      }
    }
  }

  heartGame(gameId: Number) {
    if(this.loggedIn) {
      this.heartedGame.gameId = gameId;
      this.heartedGame.userId = this.user.id;
      this.dataService.heartGame(this.heartedGame)
          .subscribe((confirmation) => {
            if(confirmation) {
              this.openSnackBar("Успешно ја додадовте играта во омилени", "Во ред");
            }
            else {
              this.openSnackBar("Играта е отстранета од омилени", "Во ред");
            }
            return;
          });
    }
    else {
      this.openSnackBar("Мора да бидете логирани за да додавате игри во омилени", "Во ред");
    }
  }

  deleteGame() {
    if(this.game) {
      this.dataService.deleteGame(String(this.game.id))
          .subscribe(() => {
            this.router.navigate(['/games']);
            this.openSnackBar("Успешно ја избришавте играта", "Во ред");
          });
    }
  }

  copyUrl() {
    this.clipboard.copy(String(window.location));
    this.openSnackBar("Линкот е копиран", "Во ред");
  }

  playGame() {
    //this.router.navigate(['/game/' + this.game.id + '/play'])
    window.location.replace("/game/" + this.game.id + "/play");
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
