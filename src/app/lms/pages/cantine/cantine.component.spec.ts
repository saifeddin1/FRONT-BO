import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CantineComponent } from './cantine.component';

describe('CantineComponent', () => {
  let component: CantineComponent;
  let fixture: ComponentFixture<CantineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CantineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CantineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
