import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/shared/data/data.service';
import { Answer, Category, Game, Question, QuestionType } from 'src/app/shared/data/interfaces';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { BottomSheetComponent } from '../creategame/bottom-sheet/bottom-sheet.component'

@Component({
  selector: 'app-editgame',
  templateUrl: './editgame.component.html',
  styleUrls: ['./editgame.component.scss']
})
export class EditgameComponent implements OnInit {
  gameId: string;
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
    questions: []
  };
  categories: Category[] = [];
  
  constructor(private dataService: DataService, private router: Router, private route: ActivatedRoute, private snackBar: MatSnackBar, private _bottomSheet: MatBottomSheet, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.dataService.getCategories()
        .subscribe((cats: Category[]) => {
          this.categories = cats;
        });
    this.addQuestion();
    this.gameId = this.route.snapshot.paramMap.get('id');
    this.dataService.getGame(Number(this.gameId))
        .subscribe((data) => {
          this.game = data;
          this.questions = this.game.questions;
        });
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
      type: QuestionType.SELECTION,
      mergingAnswers: []
    };
    this.questions.push(newQuestion);
    this.addAnswer(newQuestion);
  }

  addAnswer(question) {
    if(question.type == 0) {
      if(this.questions[question.id-1].answers.length > 3) {
        return;
      }
      let newAnswer = {
        id: this.questions[question.id-1].answers.length + 1,
        answer: '',
        isCorrect: false
      };
      this.questions[question.id-1].answers.push(newAnswer);
    }
    else if(question.type == 1) {
      if(this.questions[question.id-1].answers.length > 9) {
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
    if(this.questions[id-1].type == 0) {
      if(this.questions[id-1].answers.length < 2) {
        return;
      }
      this.questions[id-1].answers = this.questions[id-1].answers.filter(a => a != answer);
      this.questions[id-1].answers.forEach(a => {
        this.aCounter+=1;
        a.id = this.aCounter;
      });
    }
    else if(this.questions[id-1].type == 1) {
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

  changeQuestionType(question) {
    const bottomSheetRef = this._bottomSheet.open(BottomSheetComponent, {data: {type: question.type}});
    bottomSheetRef.afterDismissed().subscribe((data) => {
      if(data != undefined) {
        question.type = data;
        question.answers = [];
        question.mergingAnswers = [];
        this.addAnswer(question);
      }
    });
  }
  
  bgEnter() {
    this.bgButton = true;
  }

  bgLeave(answer?: any) {
    if(!this.locked) {
      this.bgUrl = false;
      this.bgLinks = false;
      this.bgButton = false;
      this.headerBgButton = false;
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
        // const formData = new FormData();
        // formData.append("photo", file);
        // const upload$ = this.http.post("/api/thumbnail-upload", formData);
        // upload$.subscribe();
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (e:any) => {
          if(question.type == 0 && answerId == undefined && num == undefined) {
            question.photo = e.target.result;
          }
          else {
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
          this.locked = false;
          this.bgLeave();
        }
    }
  }
  
  nextStage() {
    this.resetDefaults();
    this.stage = this.stage + 1;
  }

  prevStage() {
    this.resetDefaults();
    this.stage = this.stage - 1;
  }

  finishEditingGame() {
    this.game.questions = this.questions;
    this.dataService.editGame(this.game)
        .subscribe((data) => {
              this.openSnackBar("Успешно направивте промени на играта!", "Во ред");
              this.router.navigate(['/game/'+data])
          }, () => {
            this.openSnackBar("Неуспешни промени!", "Обиди се повторно");
          });
  }

  addCategory(event, category) {
    if(event.checked) {
      this.game.categories.push(category);
      console.log(this.game.categories);
    }
    else {
      this.game.categories = this.game.categories.filter(cat => cat != category);
      console.log(this.game.categories);
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
}
