import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/shared/data/data.service';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss']
})
export class TopComponent implements OnInit {

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
  }

  randomGame() {
    this.dataService.getRandomGameId()
        .subscribe((id: Number) => {
          if(id) {
            this.router.navigate(['/game/' + id]);
          }
        });
  }
}
