import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VcDashboardComponent } from './vc-dashboard.component';

describe('VcDashboardComponent', () => {
  let component: VcDashboardComponent;
  let fixture: ComponentFixture<VcDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VcDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VcDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
