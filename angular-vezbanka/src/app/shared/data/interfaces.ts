export interface Answer{
  id?: Number;
  answer: string;
  correct?: boolean;
  selected?: boolean;
  isCorrect?: boolean;
  isSelected?: boolean;
}

export interface MergingAnswers {
  id?: Number;
  photo1?: string;
  photo2?: string;
  bgButton1?: boolean;
  bgButton2?: boolean;
}

export interface ClassificationCategory {
  id?: Number;
  name: string;
  photo?: string;
  words?: string[];
  bgButtonCat?: boolean;
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
  questionType?: QuestionType;
  mergingAnswers?: MergingAnswers[];
  classes?: ClassificationCategory[];
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
  creatorId?: Number;
  categoryIds?: Number[];
  usersHeartedIds?: Number[];
}

export interface HeartedGame {
  userId: Number;
  gameId: Number;
}
