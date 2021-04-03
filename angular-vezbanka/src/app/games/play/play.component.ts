import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/shared/data/data.service';
import { Game, Question } from 'src/app/shared/data/interfaces';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import fscreen from "fscreen";

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit, OnDestroy {
  hasFullscreenSupport: boolean = fscreen.fullscreenEnabled;
  isFullscreen: boolean;
  id: string;
  game: Game;
  optionToggle: boolean = false;
  overlayToggle: boolean = false;
  exitToggle: boolean = false;
  startToggle: boolean = false;
  resultToggle: boolean = false;
  soundToggle: boolean = true;
  explanationToggle: boolean = false;
  seconds: string = '30';
  questionIndex: number = 0;
  numQuestions: number = 0;
  loading: boolean = true;
  result: string = '';
  questions: Question[] = [];
  isScreenSmall: boolean;
  score: number = 0;
  shareTitle: string = 'Највисок скор на Вежбанка - [SCORE]pts';
  shareMessage: string = '[SCORE] е мојот нов најдобар резултат на Вежбанка! Пробај ја и ти!';
  submited: boolean = false;
  photoStage: boolean = true;

  constructor(private dataService: DataService, private route: ActivatedRoute, private router: Router, private breakpointObserver: BreakpointObserver) {
    if (this.hasFullscreenSupport) {
      fscreen.addEventListener('fullscreenchange', () => {
        this.isFullscreen = (fscreen.fullscreenElement !== null);
      }, false);
    }
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.dataService.getGame(Number(this.id))
        .subscribe((data: Game) => {
          this.game = data;
          this.numQuestions = this.game.questions.length;
          this.questions = this.game.questions;
          if(!this.questions[this.questionIndex].photo) {
            this.photoStage = false;
          }
          this.loading = false;
        }, () => window.location.assign("/games"));
    this.isScreenSmall = this.breakpointObserver.isMatched('(max-width: 599px)');
  }

  ngOnDestroy() {
    if (this.hasFullscreenSupport) {
      fscreen.removeEventListener('fullscreenchange');
    }
  }

  toggleFullscreen() {
    if (this.hasFullscreenSupport && !this.isFullscreen) {
      const elem = document.body;
      fscreen.requestFullscreen(elem);
    } else {
      fscreen.exitFullscreen();
    }
  }

  startGame() {
    this.startToggle = true;
    this.startTimer();
  }
  
  startTimer() {
    var interval_id = window.setInterval("", 9999);
    for (var i = 1; i < interval_id; i++)
        window.clearInterval(i);
    let intervalId = setInterval(() => {
      if(Number(this.seconds) == 26) {
        this.photoStage = false;
      }
      if(Number(this.seconds) < 1 && !this.submited) {
        clearInterval(intervalId);
        this.result = "Времето истече!";
        this.explanationToggle = true;
        return;
      }
      if(Number(this.seconds) > 0) {
        this.seconds = String(Number(this.seconds) - 1);
        if(Number(this.seconds) < 10) {
          this.seconds = '0' + this.seconds;
        }
      }
    }, 1000);
  }

  nextQuestion() {
    let start = new Date().getTime();
    while (new Date().getTime() < start + 200);
    this.submited = false;
    if(this.questionIndex + 1 >= this.questions.length) {
      this.explanationToggle = false;
      this.resultToggle = true;
      this.game.questions = this.questions;
      this.dataService.finishGame(this.game);
      return;
    }
    this.questionIndex = this.questionIndex + 1;
    if(this.questions[this.questionIndex].photo) {
      this.photoStage = true;
    }
    this.explanationToggle = false;
    this.seconds = '30';
    this.startTimer();
  }

  goBackToGame() {
    window.location.replace("/game/" + this.id);
  }

  toggleAnswerSelection(answer) {
    answer.selected = !answer.selected;
  }

  submitQuestion(question) {
    this.result = "";
    this.submited = true;
    this.seconds = "00";
    question.answers.forEach(a => {
      console.log((a.selected && !a.correct) || (a.correct && !a.selected));
      if((a.selected && !a.correct) || (a.correct && !a.selected)) {
        this.result = "Неточно";
        this.explanationToggle = true;
      }
    });
    if(!this.result && question.answers.length > 0) {
      this.result = "Точно";
      this.score += 1;
    }
    this.explanationToggle = true;
  }

  share(action){
    let loc = location.href;
    loc = loc.substring(0, loc.lastIndexOf("/") + 1);
    
    let title = '';
    let text = '';
    
    title = this.shareTitle.replace("[SCORE]", String(this.score));
    text = this.shareMessage.replace("[SCORE]", String(this.score));
    let shareurl = '';
    
    if( action == 'twitter' ) {
      shareurl = 'https://twitter.com/intent/tweet?url='+loc+'&text='+text;
    }else if( action == 'facebook' ){
      shareurl = 'https://www.facebook.com/sharer/sharer.php?href='+encodeURIComponent(loc);
    }else if( action == 'google' ){
      shareurl = 'https://plus.google.com/share?url='+loc;
    }
    
    window.open(shareurl);
  }

  playAgain() {
    window.location.reload();
  }
}
