import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonFilledComponent } from './button-filled.component';

describe('ButtonFilledComponent', () => {
  let component: ButtonFilledComponent;
  let fixture: ComponentFixture<ButtonFilledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonFilledComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonFilledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
