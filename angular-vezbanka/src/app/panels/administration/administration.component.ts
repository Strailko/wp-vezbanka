import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/data/data.service';
import { User } from 'src/app/shared/data/interfaces';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent implements OnInit {
  users: User[] = [];

  constructor(private dataService: DataService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.dataService.getAllProfiles()
        .subscribe((data) => {
            this.users = data;
        });
  }

  changeRole(user, role) {
    this.dataService.changeRole(user, role)
        .subscribe((data) => {
          this.ngOnInit();
          this.openSnackBar('Успешна промена на улога', 'Во ред');
        }, () => this.openSnackBar('Настана грешка', 'Обиди се повторно'));
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
