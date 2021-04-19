import { ComponentRef, Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core'
import { Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay'
import { ComponentPortal } from '@angular/cdk/portal'
import { TooltipComponent } from '../atoms/tooltip/tooltip.component'

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective implements OnInit {

  @Input('appTooltip') text = ''
  private overlayRef: OverlayRef

  constructor(private overlay: Overlay,
              private overlayPositionBuilder: OverlayPositionBuilder,
              private elementRef: ElementRef) {
  }

  ngOnInit(): void {
    if (!this.text) {
      return
    }
    this.elementRef.nativeElement.style.cursor = 'help'
    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(this.elementRef)
      .withPositions([{
        originX: 'center',
        originY: 'bottom',
        overlayX: 'center',
        overlayY: 'top',
        offsetY: 8
      }])

    this.overlayRef = this.overlay.create({ positionStrategy })
  }

  @HostListener('mouseenter')
  show(): void {
    if (!this.text) {
      return
    }
    const tooltipRef: ComponentRef<TooltipComponent>
      = this.overlayRef.attach(new ComponentPortal(TooltipComponent))
    tooltipRef.instance.text = this.text
  }

  @HostListener('mouseout')
  hide(): void {
    if (!this.text) {
      return
    }
    this.overlayRef.detach()
  }
}
