export interface Answer{
  id?: Number;
  answer: string;
  isCorrect: boolean;
}

export interface MergingAnswers {
  id?: Number;
  photo1?: string;
  photo2?: string;
  bgButton1?: boolean;
  bgButton2?: boolean;
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
  lastName?:string;
  email:string;
  photo?:string;
  role?:Role;
  biography?:string;
}

export interface Question{
  id?:Number;
  content:string;
  photo:string;
  answers?:Answer[];
  type:QuestionType;
  mergingAnswers?: MergingAnswers[];
}

export interface Category{
  id?: Number;
  name:string;
  shortDescription:string;
  coverPhoto:string;
  games?: Game[];
}

export interface Game{
  id?:Number;
  name:string;
  numberOfPlayers?:Number;
  dateCreated?:string;
  numberOfHearts?:Number;
  photo:string;
  shortDescription:string;
  creator?:User;
  player?:User;
  questions?:Question[];
  categories?:Category[];
}

export interface HeartedGame {
  userId?: Number;
  gameId?: Number;
}