import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/data/data.service';
import { Category } from '../shared/data/interfaces';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  categories: Category[] = [];
  loggedIn: boolean = false;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    if(localStorage.getItem('access_token')) {
      this.loggedIn = true;
    }
    this.dataService.getCategories()
        .subscribe((cats: Category[]) => {
          this.categories = cats;
        });
  }

}
