import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListNiveauMatiereComponent } from './list-niveau-matiere.component';

describe('ListNiveauMatiereComponent', () => {
  let component: ListNiveauMatiereComponent;
  let fixture: ComponentFixture<ListNiveauMatiereComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListNiveauMatiereComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListNiveauMatiereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
