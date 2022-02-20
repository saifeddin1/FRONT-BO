import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VcSettingsComponent } from './vc-settings.component';

describe('VcSettingsComponent', () => {
  let component: VcSettingsComponent;
  let fixture: ComponentFixture<VcSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VcSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VcSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
