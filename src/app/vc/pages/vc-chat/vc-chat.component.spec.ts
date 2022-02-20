import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VcChatComponent } from './vc-chat.component';

describe('VcChatComponent', () => {
  let component: VcChatComponent;
  let fixture: ComponentFixture<VcChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VcChatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VcChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
