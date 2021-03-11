import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopplayedComponent } from './topplayed.component';

describe('TopplayedComponent', () => {
  let component: TopplayedComponent;
  let fixture: ComponentFixture<TopplayedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopplayedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopplayedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
