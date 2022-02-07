import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEnregistrementComponent } from './list-enregistrement.component';

describe('ListEnregistrementComponent', () => {
  let component: ListEnregistrementComponent;
  let fixture: ComponentFixture<ListEnregistrementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEnregistrementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEnregistrementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
