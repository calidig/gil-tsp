import { ComponentFixture, TestBed } from '@angular/core/testing'

import { RouteStatusComponent } from './route-status.component'

describe('RouteStatusComponent', () => {
  let component: RouteStatusComponent
  let fixture: ComponentFixture<RouteStatusComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RouteStatusComponent]
    })
      .compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteStatusComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
