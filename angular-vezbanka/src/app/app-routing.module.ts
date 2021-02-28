import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { CreategameComponent } from './games/creategame/creategame.component';
import { EditgameComponent } from './games/editgame/editgame.component';
import { GameComponent } from './games/game/game.component';
import { GamesComponent } from './games/games.component';
import { PlayComponent } from './games/play/play.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: '', component: LandingComponent, pathMatch: 'full' },
  { path: 'game/:id/play', component: PlayComponent, pathMatch: 'prefix'},
  { path: 'game/:id/edit', component: EditgameComponent, pathMatch: 'full'},
  { path: 'game/:id', component: GameComponent, pathMatch: 'prefix'},
  { path: 'games/create', component: CreategameComponent, pathMatch: 'full'},
  { path: 'games/:type', component: GamesComponent, pathMatch: 'prefix'},
  { path: 'games', component: GamesComponent, pathMatch: 'full'},
  { path: 'newgame', component: CreategameComponent, pathMatch: 'full'},
  { path: 'login', component: LoginComponent, pathMatch: 'full'},
  { path: 'profile/:id', component: ProfileComponent, pathMatch: 'prefix'},
  { path: 'profile', component: ProfileComponent, pathMatch: 'full'},
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
