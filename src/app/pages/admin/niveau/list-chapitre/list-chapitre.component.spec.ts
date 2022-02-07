import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListChapitreComponent } from './list-chapitre.component';

describe('ListChapitreComponent', () => {
  let component: ListChapitreComponent;
  let fixture: ComponentFixture<ListChapitreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListChapitreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListChapitreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
