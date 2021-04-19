import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitSvgComponent } from './exit-svg.component';

describe('ExitSvgComponent', () => {
  let component: ExitSvgComponent;
  let fixture: ComponentFixture<ExitSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExitSvgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExitSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
