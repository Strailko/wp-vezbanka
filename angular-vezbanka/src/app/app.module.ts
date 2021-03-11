import { BrowserModule } from '@angular/platform-browser';
import { ApplicationModule, NgModule } from '@angular/core';
import { MaterialModule } from './shared/material/material.module';
import { AuthModule } from './shared/auth/auth.module';
import { HttpClientModule } from '@angular/common/http';
import { ClipboardModule } from '@angular/cdk/clipboard'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PreloaderComponent } from './preloader/preloader.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RsidebarComponent } from './rsidebar/rsidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LandingComponent } from './landing/landing.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TopComponent } from './landing/top/top.component';
import { ToprankedComponent } from './landing/games/topranked/topranked.component';
import { TopplayedComponent } from './landing/games/topplayed/topplayed.component';
import { LatestComponent } from './landing/games/latest/latest.component';
import { GamesComponent } from './games/games.component';
import { SearchComponent } from './search/search.component';
import { CreategameComponent } from './games/creategame/creategame.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { RegisterDialogComponent } from './login/register-dialog/register-dialog.component';
import { GameComponent } from './games/game/game.component';
import { PlayComponent } from './games/play/play.component';
import { EditgameComponent } from './games/editgame/editgame.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    PreloaderComponent,
    SidebarComponent,
    RsidebarComponent,
    NavbarComponent,
    LandingComponent,
    TopComponent,
    ToprankedComponent,
    TopplayedComponent,
    LatestComponent,
    GamesComponent,
    SearchComponent,
    CreategameComponent,
    ProfileComponent,
    LoginComponent,
    RegisterDialogComponent,
    GameComponent,
    PlayComponent,
    EditgameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    AuthModule,
    ClipboardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
