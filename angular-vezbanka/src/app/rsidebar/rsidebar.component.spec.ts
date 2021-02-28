import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RsidebarComponent } from './rsidebar.component';

describe('RsidebarComponent', () => {
  let component: RsidebarComponent;
  let fixture: ComponentFixture<RsidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RsidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RsidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
