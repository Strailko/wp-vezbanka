import { BrowserModule } from '@angular/platform-browser';
import { ApplicationModule, NgModule } from '@angular/core';
import { MaterialModule } from './shared/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { DragDropModule } from '@angular/cdk/drag-drop'; 

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
import { GameComponent } from './games/game/game.component';
import { PlayComponent } from './games/play/play.component';
import { BottomSheetComponent } from './games/creategame/bottom-sheet/bottom-sheet.component';

import { AutofocusDirective } from './shared/directives/autofocus.directive';
import { authInterceptorProviders } from './shared/auth/auth.interceptor';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { ModerationComponent } from './panels/moderation/moderation.component';
import { AdministrationComponent } from './panels/administration/administration.component';
import { CategoryEditComponent } from './panels/moderation/category-edit/category-edit.component';

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
    GameComponent,
    PlayComponent,
    BottomSheetComponent,
    AutofocusDirective,
    EditProfileComponent,
    ModerationComponent,
    AdministrationComponent,
    CategoryEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    DragDropModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    ClipboardModule,
    MatBottomSheetModule,
    DragDropModule
  ],
  providers: [authInterceptorProviders],
  entryComponents: [
    BottomSheetComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
