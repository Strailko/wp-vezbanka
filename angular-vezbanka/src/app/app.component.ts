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
    let pathname = window.location.pathname;
    let path = pathname.split("/");
    if(path.includes("play") && path.includes("game")) {
      this.isPlaying = true;
    }
  }
  
}