import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAssignFileMediaComponent } from './list-assign-file-media.component';

describe('ListAssignFileMediaComponent', () => {
  let component: ListAssignFileMediaComponent;
  let fixture: ComponentFixture<ListAssignFileMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAssignFileMediaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAssignFileMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
