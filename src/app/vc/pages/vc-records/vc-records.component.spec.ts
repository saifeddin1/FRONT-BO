import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VcRecordsComponent } from './vc-records.component';

describe('VcRecordsComponent', () => {
  let component: VcRecordsComponent;
  let fixture: ComponentFixture<VcRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VcRecordsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VcRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
