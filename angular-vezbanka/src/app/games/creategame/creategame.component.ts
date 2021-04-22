import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/shared/data/data.service';
import { Answer, Category, Game, Question, QuestionType } from 'src/app/shared/data/interfaces';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { BottomSheetComponent } from './bottom-sheet/bottom-sheet.component'
import { TokenStorageService } from 'src/app/shared/auth/token-storage.service';


@Component({
  selector: 'app-creategame',
  templateUrl: './creategame.component.html',
  styleUrls: ['./creategame.component.scss']
})
export class CreategameComponent implements OnInit {
  gameId: string;
  IsEditingGame: boolean = false;
  editMode: boolean = true;
  questions: Question[] = [];
  deleteQuestionMode: boolean = false;
  qCounter = 0;
  aCounter = 0;
  bgButton: boolean = false;
  headerBgButton: boolean = false;
  bgLinks: boolean = false;
  bgUrl: boolean = false;
  fileName: string;
  locked: boolean = false;
  stage = 0;
  game: Game = {
    name: '',
    photo: '../../../assets/img/cover1.jpg',
    shortDescription: '',
    categories: [],
    questions: [],
    categoryIds: []
  };
  categories: Category[] = [];

  constructor(private dataService: DataService, private router: Router, private route: ActivatedRoute, private snackBar: MatSnackBar,
              private _bottomSheet: MatBottomSheet, private changeDetectorRef: ChangeDetectorRef,
              private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.dataService.getCategories()
    .subscribe((cats: Category[]) => {
      this.categories = cats;
    });
    this.addQuestion();

    if(this.route.snapshot.url[1].path !== "create") {
      this.gameId = this.route.snapshot.paramMap.get('id');
      if(this.gameId) {
        this.dataService.getGame(Number(this.gameId))
            .subscribe((data) => {
              this.game = data;
              let usr = this.tokenStorageService.getUser();
              if(this.game.creatorId === usr.id || usr.roles.includes("MODERATOR") || usr.roles.includes("ADMIN")) {
                this.questions = this.game.questions;
                this.questions.forEach(q => {
                  this.qCounter+=1;
                  q.id = this.qCounter;
                  q.answers.forEach(a => a.id = this.rand());
                });
                this.qCounter = 0;
                this.IsEditingGame = true;
              }
              else {
                this.router.navigate(['/games/create']);
              }
            }, () => this.router.navigate(['/games/create']));
      }
    }
  }

  addQuestion() {
    if(this.questions.length > 10) {
      return;
    }
    let newQuestion = {
      id: this.questions.length + 1,
      content: '',
      photo: '../../../assets/img/cover1.jpg',
      answers: [],
      questionType: QuestionType.SELECTION,
      mergingAnswers: [],
      classes: []
    };
    this.questions.push(newQuestion);
    this.addAnswer(newQuestion);
  }

  addAnswer(question) {
    if(question.questionType == 0) {
      if(this.questions[question.id-1].answers.length > 3) {
        return;
      }
      let newAnswer = {
        id: this.questions[question.id-1].answers.length + 1,
        answer: '',
        isCorrect: false,
        isSelected: false
      };
      this.questions[question.id-1].answers.push(newAnswer);
    }
    else if(question.questionType == 1) {
      if(this.questions[question.id-1].mergingAnswers.length > 9) {
        return;
      }
      let newAnswer = {
        id: this.questions[question.id-1].mergingAnswers.length + 1,
        photo1: '../../../assets/img/cover1.jpg',
        photo2: '../../../assets/img/cover3.jpg',
        bgButton1: false,
        bgButton2: false
      };
      this.questions[question.id-1].mergingAnswers.push(newAnswer);
    }
    else if(question.questionType == 2) {
      if(this.questions[question.id-1].classes.length >= 2) {
        return;
      }
      let newCategory = {
        id: this.questions[question.id-1].classes.length,
        name: '',
        photo: '../../../assets/img/cover1.jpg',
        words: [''],
        bgButtonCat: false
      };
      this.questions[question.id-1].classes.push(newCategory);
    }
  }

  addWord(questionId, catId) {
    this.questions[questionId-1].classes[catId].words.push('');
  }

  deleteQuestion(question) {
    if(this.questions.length < 2) {
      return;
    }
    this.questions = this.questions.filter(q => q != question);
    this.questions.forEach(q => {
      this.qCounter+=1;
      q.id = this.qCounter;
    });
    this.qCounter = 0;
  }

  deleteAnswer(answer, id) {
    if(this.questions[id-1].questionType == 0) {
      if(this.questions[id-1].answers.length < 2) {
        return;
      }
      this.questions[id-1].answers = this.questions[id-1].answers.filter(a => a != answer);
      this.questions[id-1].answers.forEach(a => {
        this.aCounter+=1;
        a.id = this.aCounter;
      });
    }
    else if(this.questions[id-1].questionType == 1) {
      if(this.questions[id-1].mergingAnswers.length < 2) {
        return;
      }
      this.questions[id-1].mergingAnswers = this.questions[id-1].mergingAnswers.filter(a => a != answer);
      this.questions[id-1].mergingAnswers.forEach(a => {
        this.aCounter+=1;
        a.id = this.aCounter;
      });
    }
    this.aCounter = 0;
  }

  deleteWord(word, questionId, catIndex) {
    this.questions[questionId-1].classes[catIndex].words = this.questions[questionId-1].classes[catIndex].words.filter(w => w != word);
    if(this.questions[questionId-1].classes[catIndex].words.length < 1) {
      this.addWord(questionId, catIndex);
    }
  }

  changeQuestionType(question) {
    const bottomSheetRef = this._bottomSheet.open(BottomSheetComponent, {data: {questionType: question.questionType}});
    bottomSheetRef.afterDismissed().subscribe((data) => {
      if(data != undefined) {
        question.questionType = data;
        question.answers = [];
        question.mergingAnswers = [];
        question.classes = [];
        this.addAnswer(question);
        if(question.questionType == 2) {
          this.addAnswer(question);
        }
      }
    });
  }

  bgEnter() {
    this.bgButton = true;
  }

  bgEnterCat(question, num) {
    if(num == 1) {
      question.classes[0].bgButtonCat = false;
    }
    if(num == 0) {
      question.classes[1].bgButtonCat = false;
    }
    question.classes[num].bgButtonCat = true;
  }

  bgLeave(answer?: any, question?: any) {
    if(!this.locked) {
      this.bgUrl = false;
      this.bgLinks = false;
      this.bgButton = false;
      this.headerBgButton = false;
      if(answer == 0 && question) {
        question.classes[0].bgButtonCat = false;
        return;
      }
      if(answer == 1 && question) {
        question.classes[1].bgButtonCat = false;
        return;
      }
      if(answer) {
        answer.bgButton1 = false;
        answer.bgButton2 = false;
      }
    }
  }

  changeBackground() {
    this.bgLeave();
  }

  fileSelected(event: any, question: any, answerId?: any, num?: any) {
    const file:File = event.target.files[0];
    if (file) {
        this.fileName = file.name;
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (e:any) => {
          if(question.questionType == 0 && answerId == undefined && num == undefined) {
            question.photo = e.target.result;
          }
          else if(question.questionType == 1) {
            if(num == 1) {
              question.mergingAnswers[answerId-1].photo1 = e.target.result;
              question.mergingAnswers[answerId-1].bgButton1 = false;
            }
            else if(num == 2) {
              question.mergingAnswers[answerId-1].photo2 = e.target.result;
              question.mergingAnswers[answerId-1].bgButton2 = false;
            }
            else {
              question.photo = e.target.result;
            }
          }
          else if(question.questionType == 2) {
            question.classes[num].photo = e.target.result;
            question.classes[num].bgButtonCat = false;
          }
          this.locked = false;
          this.bgLeave();
        }
    }
  }

  fileSelectedGame(event: any, game: any) {
    const file:File = event.target.files[0];
    if (file) {
        this.fileName = file.name;
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (e:any) => {
          game.photo = e.target.result;
          this.locked = false;
          this.bgLeave();
        }
    }
  }

  setWord($event, i, catIndex) {
    console.log($event);
  }

  nextStage() {
    this.resetDefaults();
    this.stage = this.stage + 1;
  }

  prevStage() {
    this.resetDefaults();
    this.stage = this.stage - 1;
  }

  finishCreatingGame() {
    let hasCorrectAnswer = false;
    let questionsValidated = true;
    for(var q of this.questions) {
      hasCorrectAnswer = false;
      if(!q.content) {
        questionsValidated = false;
      }
      if(q.answers.length < 1 && q.questionType == 0) {
        questionsValidated = false;
      }
      if(q.questionType == 2) {
        hasCorrectAnswer = true;
      }
      q.answers.forEach((a) => {
        if(a.isCorrect && q.questionType == 0) {
          hasCorrectAnswer = true;
        }
        if(!a.answer && q.questionType == 0) {
          questionsValidated = false;
        }
      });
      if(!hasCorrectAnswer) break;
    }
    if(!hasCorrectAnswer) {
      this.openSnackBar("Прашањата мора да имаат барем еден точен одговор", "Дополни");
      return;
    }
    if(this.questions.length < 3) {
      this.openSnackBar("Минималниот број на прашања е 3", "Дополни");
      return;
    }
    if(!this.game.name || !this.game.shortDescription || !questionsValidated) {
      this.openSnackBar("Сите полиња се задолжителни", "Дополни");
      return;
    }
    this.game.questions = this.questions;
    this.game.creatorId = this.tokenStorageService.getUser().id;
    this.game.categoryIds = this.categories.map(cat => {
      if(this.game.categoryIds.includes(cat.id))
        return cat.id;
    });
    this.game.categoryIds = this.game.categoryIds.filter(cat => cat != null);
    if(this.IsEditingGame) {
      this.game.questions = this.questions;
      this.dataService.editGame(this.game)
          .subscribe((data) => {
                this.openSnackBar("Успешно направивте промени на играта!", "Во ред");
                this.router.navigate(['/game/'+data.id])
            }, () => {
              this.openSnackBar("Неуспешни промени!", "Обиди се повторно");
            });
    }
    else {
      this.dataService.createGame(this.game)
          .subscribe((data) => {
                this.openSnackBar("Успешно креиравте нова игра!", "Во ред");
                this.router.navigate(['/game/'+data.id])
            }, () => {
              this.openSnackBar("Неуспешно креирање на нова игра!", "Обиди се повторно");
            });
    }
  }

  addCategory(event, category) {
    if(event.checked) {
      this.game.categoryIds.push(category.id);
    }
    else {
      this.game.categoryIds = this.game.categoryIds.filter(catId => catId != category.id);
    }
  }

  resetDefaults() {
    this.editMode = true;
    this.deleteQuestionMode = false;
    this.bgButton = false;
    this.bgLinks = false;
    this.bgUrl = false;
    this.locked = false;
  }

  turnEditMode() {
    this.editMode = !this.editMode;
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  customTrackBy(index: number, obj: any): any {
    return index;
  }

  rand() : number {
      return Math.floor(Math.random() * (9999999 - 1000000) + 1000000);
  }
}
