import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmplyeeProfileComponent } from './emplyee-profile.component';

describe('EmplyeeProfileComponent', () => {
  let component: EmplyeeProfileComponent;
  let fixture: ComponentFixture<EmplyeeProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmplyeeProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmplyeeProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
