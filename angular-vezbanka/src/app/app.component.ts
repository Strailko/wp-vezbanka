import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'vezbanka';
  isPlaying: boolean = false;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    if(window.location.pathname.includes("play") && window.location.pathname.includes("game")) {
      this.isPlaying = true;
    }
  }
  
}