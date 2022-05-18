import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateTimesheetsPopupComponent } from './generate-timesheets-popup.component';

describe('GenerateTimesheetsPopupComponent', () => {
  let component: GenerateTimesheetsPopupComponent;
  let fixture: ComponentFixture<GenerateTimesheetsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateTimesheetsPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateTimesheetsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
