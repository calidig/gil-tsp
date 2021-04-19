import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewClusterComponent } from './preview-cluster.component';

describe('PreviewClusterComponent', () => {
  let component: PreviewClusterComponent;
  let fixture: ComponentFixture<PreviewClusterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewClusterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewClusterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
