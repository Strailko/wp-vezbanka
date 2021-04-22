import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { TokenStorageService } from 'src/app/shared/auth/token-storage.service';
import { DataService } from 'src/app/shared/data/data.service';
import { Category } from 'src/app/shared/data/interfaces';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.scss']
})
export class CategoryEditComponent implements OnInit {
  categoryId: string;
  IsEditing: boolean = false;
  bgButton: boolean = false;
  bgLinks: boolean = false;
  bgUrl: boolean = false;
  fileName: string;
  locked: boolean = false;
  editForm: FormGroup;
  error = false;
  category: Category = {
    name: '',
    shortDescription: '',
    coverPhoto: '../../../assets/img/cover1.jpg'
  }

  constructor(private dataService: DataService ,private authService: AuthService, private snackBar: MatSnackBar, private storage: TokenStorageService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.editForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      shortDescription: new FormControl('', [Validators.required]),
    });
    if(this.route.snapshot.url[1].path !== "create") {
      this.categoryId = this.route.snapshot.paramMap.get('id');
      if(this.categoryId) {
        this.dataService.getCategory(Number(this.categoryId))
            .subscribe((data) => {
                this.category = data;
                this.IsEditing = true;
              },
            () => this.router.navigate(['/category/create']));
      }
    }
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

  fileSelected(event: any) {
    const file:File = event.target.files[0];
    if (file) {
        this.fileName = file.name;
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (e:any) => {
          this.category.coverPhoto = e.target.result;
          this.locked = false;
          this.bgLeave();
        }
    }
  }

  finishEditing() {
    if(!this.category.coverPhoto || !this.category.name || !this.category.shortDescription) {
      this.openSnackBar("Сите полиња се задолжителни!", "Обиди се повторно");
      this.error = true;
      return false;
    }
    if(this.IsEditing) {
      this.dataService.editCategory(this.category)
          .subscribe((data) => {
                this.openSnackBar("Успешно направивте промени на категоријата!", "Во ред");
                this.router.navigate(['/panel/mod'])
            }, () => {
              this.openSnackBar("Неуспешни промени!", "Обиди се повторно");
            });
    }
    else {
      this.dataService.createCategory(this.category)
          .subscribe((data) => {
                this.openSnackBar("Успешно креиравте нова категорија!", "Во ред");
                this.router.navigate(['/panel/mod'])
            }, () => {
              this.openSnackBar("Неуспешно креирање на нова категорија!", "Обиди се повторно");
            });
    }
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

}
