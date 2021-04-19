import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutSvgComponent } from './logout-svg.component';

describe('LogoutSvgComponent', () => {
  let component: LogoutSvgComponent;
  let fixture: ComponentFixture<LogoutSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogoutSvgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
