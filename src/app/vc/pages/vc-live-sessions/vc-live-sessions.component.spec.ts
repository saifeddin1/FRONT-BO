import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VcLiveSessionsComponent } from './vc-live-sessions.component';

describe('VcLiveSessionsComponent', () => {
  let component: VcLiveSessionsComponent;
  let fixture: ComponentFixture<VcLiveSessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VcLiveSessionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VcLiveSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
