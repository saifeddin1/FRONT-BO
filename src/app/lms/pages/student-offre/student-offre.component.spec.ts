import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentOffreComponent } from './student-offre.component';

describe('StudentOffreComponent', () => {
  let component: StudentOffreComponent;
  let fixture: ComponentFixture<StudentOffreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentOffreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentOffreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
