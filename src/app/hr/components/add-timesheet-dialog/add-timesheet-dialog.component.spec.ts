import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTimesheetDialogComponent } from './add-timesheet-dialog.component';

describe('AddTimesheetDialogComponent', () => {
  let component: AddTimesheetDialogComponent;
  let fixture: ComponentFixture<AddTimesheetDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTimesheetDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTimesheetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
