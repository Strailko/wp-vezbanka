import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/shared/data/data.service';
import { Answer, Category, Game, Question, QuestionType } from 'src/app/shared/data/interfaces';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { BottomSheetComponent } from './bottom-sheet/bottom-sheet.component'

@Component({
  selector: 'app-creategame',
  templateUrl: './creategame.component.html',
  styleUrls: ['./creategame.component.scss']
})
export class CreategameComponent implements OnInit {
  editMode: boolean = true;
  questions: Question[] = [];
  deleteQuestionMode: boolean = false;
  qCounter = 0;
  aCounter = 0;
  bgButton: boolean = false;
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
  
  constructor(private dataService: DataService, private router: Router, private route: ActivatedRoute, private _bottomSheet: MatBottomSheet, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.dataService.getCategories()
    .subscribe((cats: Category[]) => {
      this.categories = cats;
    });
    this.addQuestion();
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
      type: QuestionType.SELECTION
    };
    this.questions.push(newQuestion);
    this.addAnswer(newQuestion);
  }

  addAnswer(question) {
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
    if(this.questions[id-1].answers.length < 2) {
      return;
    }
    this.questions[id-1].answers = this.questions[id-1].answers.filter(a => a != answer);
    this.questions[id-1].answers.forEach(a => {
      this.aCounter+=1;
      a.id = this.aCounter;
    });
    this.aCounter = 0;
  }

  changeQuestionType(question) {
    const bottomSheetRef = this._bottomSheet.open(BottomSheetComponent, {data: {type: question.type}});
    bottomSheetRef.afterDismissed().subscribe((data) => {
      if(data != undefined) {
        question.type = data;
      }
    });
  }
  
  bgEnter() {
    this.bgButton = true;
  }

  bgLeave() {
    if(!this.locked) {
      this.bgUrl = false;
      this.bgLinks = false;
      this.bgButton = false;
    }
  }

  changeBackground() {
    this.bgLeave();
  }

  fileSelected(event, question) {
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
          question.photo = e.target.result;
          console.log(e.target.result);
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

  finishCreatingGame() {
    console.log("finishing");
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
}