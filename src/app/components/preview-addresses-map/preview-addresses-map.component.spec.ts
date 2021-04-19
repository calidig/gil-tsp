import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewAddressesMapComponent } from './preview-addresses-map.component';

describe('PreviewAddressesMapComponent', () => {
  let component: PreviewAddressesMapComponent;
  let fixture: ComponentFixture<PreviewAddressesMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewAddressesMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewAddressesMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
