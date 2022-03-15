import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentMatiereComponent } from './student-matiere.component';

describe('StudentMatiereComponent', () => {
  let component: StudentMatiereComponent;
  let fixture: ComponentFixture<StudentMatiereComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentMatiereComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentMatiereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
