import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToprankedComponent } from './topranked.component';

describe('ToprankedComponent', () => {
  let component: ToprankedComponent;
  let fixture: ComponentFixture<ToprankedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToprankedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToprankedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
