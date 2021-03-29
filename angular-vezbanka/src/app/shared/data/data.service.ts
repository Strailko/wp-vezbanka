import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Answer, Role, QuestionType, GameState, User, Question, Category, Game, HeartedGame } from './interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  baseApiUrl: string = `${environment.baseApiUrl}`;
  baseGameUrl: string = `${environment.baseApiUrl}/game`;
  baseCategoryUrl: string = `${environment.baseApiUrl}/category`;
  baseProfileUrl: string = `${environment.baseApiUrl}/user`;

  constructor(private http: HttpClient) { }

  getRandomGameId() : Observable<Number> {
    return this.http.get<Number>(this.baseGameUrl + '/random')
               .pipe(
                    map((gameId: Number) => {
                        return gameId;
                    }),
                    catchError(this.handleError)
               );
  }

  getGame(id: Number) : Observable<Game> {
    return this.http.get<Game>(this.baseGameUrl + '/' + id)
               .pipe(
                    map((game: Game) => {
                        return game;
                    }),
                    catchError(this.handleError)
               );
  }

  searchGames(query: string) : Observable<Game[]> {
    return this.http.get<Game[]>(this.baseGameUrl + '/search/' + query)
               .pipe(
                    map((game: Game[]) => {
                        return game;
                    }),
                    catchError(this.handleError)
               );
  }

  // TODO: Change return type to boolean: true = game successfully hearted, false = game successfully unhearted,
  heartGame(game: HeartedGame) : Observable<HeartedGame> {
    return this.http.post<HeartedGame>(this.baseProfileUrl + '/heart')
               .pipe(
                    map((game) => {
                        return game;
                    }),
                    catchError(this.handleError)
               );
  }

  getTopRankedGames() : Observable<Game[]> {
    return this.http.get<Game[]>(this.baseGameUrl + '/top-ranked')
               .pipe(
                    map((game: Game[]) => {
                        return game;
                    }),
                    catchError(this.handleError)
               );
  }

  getLatestGames() : Observable<Game[]> {
    return this.http.get<Game[]>(this.baseGameUrl + '/latest')
               .pipe(
                    map((game: Game[]) => {
                        return game;
                    }),
                    catchError(this.handleError)
               );
  }

  getTopPlayedGames() : Observable<Game[]> {
    return this.http.get<Game[]>(this.baseGameUrl + '/top-played')
               .pipe(
                    map((game: Game[]) => {
                        return game;
                    }),
                    catchError(this.handleError)
               );
  }

  getGames() : Observable<Game[]> {
    return this.http.get<Game[]>(this.baseGameUrl + '/all')
               .pipe(
                    map((game: Game[]) => {
                        return game;
                    }),
                    catchError(this.handleError)
               );
  }

  createGame(game: Game) : Observable<Game> {
    return this.http.post<Game>(this.baseGameUrl + '/create', game)
               .pipe(
                    map((data) => {
                        return data;
                    }),
                    catchError(this.handleError)
                );
  }

  editGame(game: Game) : Observable<Game> {
    return this.http.put<Game>(this.baseGameUrl + '/edit/' + game.id, game)
               .pipe(
                    map((data) => {
                        return data;
                    }),
                    catchError(this.handleError)
                );
  }

  deleteGame(gameId: string) : Observable<Game> {
    return this.http.delete<Game>(this.baseGameUrl + '/delete/' + gameId)
               .pipe(catchError(this.handleError));
  }

  finishGame(game: Game) : Observable<Game> {
    return this.http.post<Game>(this.baseGameUrl + '/submit/' + game.id, game)
               .pipe(
                    map((data) => {
                        return data;
                    }),
                    catchError(this.handleError)
                );
  }

  getCategories() : Observable<Category[]> {
    return this.http.get<Category[]>(this.baseCategoryUrl + '/all')
               .pipe(
                    map((categories: Category[]) => {
                        return categories;
                    }),
                    catchError(this.handleError)
               );
  }

  getCategory(catId: Number) : Observable<Category> {
    return this.http.get<Category>(this.baseCategoryUrl + '/' + catId)
               .pipe(
                    map((category: Category) => {
                        return category;
                    }),
                    catchError(this.handleError)
               );
  }

  getProfile(profileId: Number) : Observable<User> {
    return this.http.get<User>(this.baseProfileUrl + '/' + profileId)
               .pipe(
                    map((user: User) => {
                        return user;
                    }),
                    catchError(this.handleError)
               );
  }

  getProfileGames(profileId: Number) : Observable<Game[]> {
    return this.http.get<Game[]>(this.baseProfileUrl + '/games/' + profileId)
               .pipe(
                    map((games: Game[]) => {
                        return games;
                    }),
                    catchError(this.handleError)
               );
  }

  getProfileFavoriteGames(profileId: Number) : Observable<Game[]> {
    return this.http.get<Game[]>(this.baseProfileUrl + '/favorites/' + profileId)
               .pipe(
                    map((games: Game[]) => {
                        return games;
                    }),
                    catchError(this.handleError)
               );
  }

  getAllProfiles() : Observable<User[]> {
    return this.http.get<User[]>(this.baseProfileUrl + '/all')
               .pipe(
                    map((users: User[]) => {
                        return users;
                    }),
                    catchError(this.handleError)
               );
  }

  changeRole(user: User, role: Role) : Observable<User> {
    return this.http.put<User>(`${this.baseProfileUrl}/${user.id}/change-role/`, {"role" : role.toString()})
               .pipe(
                    map((user: User) => {
                        return user;
                    }),
                    catchError(this.handleError)
                );
  }

  register(user: User) : Observable<User> {
    return this.http.post<User>(this.baseApiUrl + '/register', user)
               .pipe(
                    map((data) => {
                        return data;
                    }),
                    catchError(this.handleError)
                );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('server error:', error);
    if (error.error instanceof Error) {
      let errMessage = error.error.message;
      return Observable.throw(errMessage);
    }
    return Observable.throw(error || 'Server error');
  }
}
