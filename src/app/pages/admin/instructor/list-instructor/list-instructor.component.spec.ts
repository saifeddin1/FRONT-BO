import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInstructorComponent } from './list-instructor.component';

describe('ListInstructorComponent', () => {
  let component: ListInstructorComponent;
  let fixture: ComponentFixture<ListInstructorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListInstructorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListInstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
