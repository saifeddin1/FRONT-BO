import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VcDevoirsComponent } from './vc-devoirs.component';

describe('VcDevoirsComponent', () => {
  let component: VcDevoirsComponent;
  let fixture: ComponentFixture<VcDevoirsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VcDevoirsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VcDevoirsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
