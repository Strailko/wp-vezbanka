import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Question, QuestionType } from 'src/app/shared/data/interfaces';

@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrls: ['./bottom-sheet.component.scss']
})
export class BottomSheetComponent implements OnInit {

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: {type: QuestionType}, private _bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>) {}

  ngOnInit(): void {
  }

  setType(event: MouseEvent, newType: QuestionType): void {
    this._bottomSheetRef.dismiss(newType);
    event.preventDefault();
  }

}
