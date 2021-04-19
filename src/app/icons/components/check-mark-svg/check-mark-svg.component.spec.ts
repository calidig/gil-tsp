import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckMarkSvgComponent } from './check-mark-svg.component';

describe('CheckMarkSvgComponent', () => {
  let component: CheckMarkSvgComponent;
  let fixture: ComponentFixture<CheckMarkSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckMarkSvgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckMarkSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
