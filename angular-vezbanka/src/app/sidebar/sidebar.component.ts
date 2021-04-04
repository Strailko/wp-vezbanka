import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../shared/auth/token-storage.service';
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
  isMod: boolean = false;
  isAdmin: boolean = false;

  constructor(private dataService: DataService, private storage: TokenStorageService) { }

  ngOnInit(): void {
    if(this.storage.getToken()) {
      this.loggedIn = true;
    }
    this.dataService.getCategories()
        .subscribe((cats: Category[]) => {
          this.categories = cats;
        });
    if(this.loggedIn) {
      if(this.storage.getUser().roles.includes("MODERATOR")) {
        this.isMod = true;
      }
      if(this.storage.getUser().roles.includes("ADMIN")) {
        this.isAdmin = true;
      }
    }
  }

}
