import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageIconSvgComponent } from './language-icon-svg.component';

describe('LanguageIconSvgComponent', () => {
  let component: LanguageIconSvgComponent;
  let fixture: ComponentFixture<LanguageIconSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LanguageIconSvgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageIconSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
