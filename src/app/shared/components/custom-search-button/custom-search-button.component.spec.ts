import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSearchButtonComponent } from './custom-search-button.component';

describe('CustomSearchButtonComponent', () => {
  let component: CustomSearchButtonComponent;
  let fixture: ComponentFixture<CustomSearchButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomSearchButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomSearchButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
