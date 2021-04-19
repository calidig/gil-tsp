import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoStatsComponent } from './demo-stats.component';

describe('DemoStatsComponent', () => {
  let component: DemoStatsComponent;
  let fixture: ComponentFixture<DemoStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemoStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
