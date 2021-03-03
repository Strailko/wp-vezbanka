export interface Answer{
  id?: Number;
  awnser: string;
  isCorrect: boolean;
}

export enum Role{
  ADMIN,
  MODERATOR,
  REGULAR
}

export enum QuestionType{
  SELECTION,
  DRAGGABLE,
  CLASSIFICATION
}

export enum GameState {
  UNOPENED,
  IN_PROGRESS,
  FINISHED
}

export interface User{
  id?:Number;
  username:string;
  password:string;
  firstName:string;
  lastName:string;
  email:string;
  photo:string;
  role:Role;
  biography:string;
}

export interface Question{
  id?:Number;
  content:string;
  photo:string;
  answers:Answer[];
}

export interface Category{
  id?: Number;
  name:string;
  shortDescription:string;
  coverPhoto:string;
  games: Game[];
}

export interface Game{
  id?:Number;
  name:string;
  numberOfPlayers:Number;
  dateCreated:Date;
  numberOfHearts:Number;
  photo:string;
  shortDescription:string;
  creator:User;
  player:User;
  questions:Question[];
  categories:Category[];
}




