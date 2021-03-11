import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth/auth.service';
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
  id: string;
  game: Game;
  loggedIn: boolean = false;
  user: User;
  heartedGame: HeartedGame;

  constructor(private snackBar: MatSnackBar, private dataService: DataService, private authService: AuthService, private router: Router, private route: ActivatedRoute, private clipboard: Clipboard) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.dataService.getGame(Number(this.id))
        .subscribe((data: Game) => {
          this.game = data;
        });
    if(localStorage.getItem('access_token')) {
      this.loggedIn = true;
      this.authService.getUser()
          .subscribe(login => {
            this.user = login.user;
          });
    }
  }

  heartGame(gameId: Number) {
    if(this.loggedIn) {
      this.heartedGame.gameId = gameId;
      this.heartedGame.userId = this.user.id;
      this.dataService.heartGame(this.heartedGame)
          .subscribe((confirmation) => {
            console.log(confirmation);
            this.openSnackBar("Успешно ја додадовте играта во омилени", "Во ред");
            return;
          });
      this.openSnackBar("Играта е веќе поставена во омилени", "Во ред");
    }
    else {
      this.openSnackBar("Мора да бидете логирани за да додавате игри во омилени", "Во ред");
    }
  }

  copyUrl() {
    this.clipboard.copy(String(window.location));
    this.openSnackBar("Линкот е копиран", "Во ред");
  }

  playGame() {
    this.router.navigate(['/game/' + this.game.id + '/play'])
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
