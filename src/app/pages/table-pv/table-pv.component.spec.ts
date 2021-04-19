import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablePVComponent } from './table-pv.component';

describe('TablePVComponent', () => {
  let component: TablePVComponent;
  let fixture: ComponentFixture<TablePVComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablePVComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablePVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
