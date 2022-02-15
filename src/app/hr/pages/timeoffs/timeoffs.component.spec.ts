import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeoffsComponent } from './timeoffs.component';

describe('TimeoffsComponent', () => {
  let component: TimeoffsComponent;
  let fixture: ComponentFixture<TimeoffsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeoffsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeoffsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
