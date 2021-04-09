import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { CreategameComponent } from './games/creategame/creategame.component';
import { GameComponent } from './games/game/game.component';
import { GamesComponent } from './games/games.component';
import { PlayComponent } from './games/play/play.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { AdministrationComponent } from './panels/administration/administration.component';
import { CategoryEditComponent } from './panels/moderation/category-edit/category-edit.component';
import { ModerationComponent } from './panels/moderation/moderation.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './shared/auth/auth.guard';
import { RoleGuard } from './shared/auth/role.guard';

const routes: Routes = [
  { path: '', component: LandingComponent, pathMatch: 'full' },
  { path: 'game/:id/play', component: PlayComponent, pathMatch: 'full' },
  { path: 'game/:id/edit', component: CreategameComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'game/:id', component: GameComponent, pathMatch: 'prefix' },
  { path: 'games/create', component: CreategameComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'games/:type/:id', component: GamesComponent, pathMatch: 'full' },
  { path: 'games/:type', component: GamesComponent, pathMatch: 'prefix' },
  { path: 'games', component: GamesComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: 'register', component: LoginComponent, pathMatch: 'full' },
  { path: 'profile/:id/edit', component: EditProfileComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'profile/:id', component: ProfileComponent, pathMatch: 'prefix' },
  { path: 'profile', component: ProfileComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'category/create', component: CategoryEditComponent, pathMatch: 'full', canActivate: [AuthGuard, RoleGuard], data: { expectedRole: ['MODERATOR', 'ADMIN'] } },
  { path: 'category/:id/edit', component: CategoryEditComponent, pathMatch: 'full', canActivate: [AuthGuard, RoleGuard], data: { expectedRole: ['MODERATOR', 'ADMIN'] } },
  { path: 'panel/mod', component: ModerationComponent, pathMatch: 'full', canActivate: [AuthGuard, RoleGuard], data: { expectedRole: ['MODERATOR', 'ADMIN'] } },
  { path: 'panel/admin', component: AdministrationComponent, pathMatch: 'full', canActivate: [AuthGuard, RoleGuard], data: { expectedRole: ['ADMIN', 'ADMIN'] } },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
