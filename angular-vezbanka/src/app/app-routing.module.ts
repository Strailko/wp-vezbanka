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
import { AuthGuard } from './shared/auth/auth.guard';
import { LoginGuard } from './shared/auth/login.guard';

const routes: Routes = [
  { path: '', component: LandingComponent, pathMatch: 'full' },
  { path: 'game/:id/play', component: PlayComponent, pathMatch: 'full' },
  { path: 'game/:id/edit', component: EditgameComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'game/:id', component: GameComponent, pathMatch: 'prefix'},
  { path: 'games/create', component: CreategameComponent, pathMatch: 'full' },
  //{ path: 'games/create', component: CreategameComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'games/:type/:id', component: GamesComponent, pathMatch: 'full'},
  { path: 'games/:type', component: GamesComponent, pathMatch: 'prefix'},
  { path: 'games', component: GamesComponent, pathMatch: 'full'},
  { path: 'newgame', component: CreategameComponent, pathMatch: 'full'},
  { path: 'login', component: LoginComponent, pathMatch: 'full', canActivate: [LoginGuard] },
  { path: 'register', component: LoginComponent, pathMatch: 'full', canActivate: [LoginGuard] },
  { path: 'profile/:id', component: ProfileComponent, pathMatch: 'prefix'},
  { path: 'profile', component: ProfileComponent, pathMatch: 'full'},
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
