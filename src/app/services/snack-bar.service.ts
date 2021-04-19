import { Inject, Injectable, Injector } from '@angular/core'
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal'
import { SnackBarComponent } from '../components/snack-bar/snack-bar.component'
import { Overlay } from '@angular/cdk/overlay'
import { ToastRef } from '../models/toast-ref'
import { TOAST_CONFIG_TOKEN, ToastConfig, ToastData } from '../models/toast-config'
import { OverlayPositionBuilder } from '@angular/cdk/overlay/position/overlay-position-builder'

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  private lastToast: ToastRef

  constructor(
    private overlay: Overlay,
    private parentInjector: Injector,
    @Inject(TOAST_CONFIG_TOKEN) private toastConfig: ToastConfig
  ) {
  }

  show(data: ToastData): ToastRef {
    const positionStrategy = this.getPositionStrategy()
    const overlayRef = this.overlay.create({ positionStrategy })

    const toastRef = new ToastRef(overlayRef)
    this.lastToast = toastRef

    const injector = this.getInjector(data, toastRef, this.parentInjector)
    const toastPortal = new ComponentPortal(SnackBarComponent, null, injector)

    overlayRef.attach(toastPortal)

    return toastRef
  }

  getPositionStrategy(): any {
    return this.overlay.position()
      .global()
      .bottom(this.getPosition())
      .right(this.toastConfig.position.right + 'px')
  }

  getPosition(): string {
    const lastToastIsVisible = this.lastToast && this.lastToast.isVisible()
    const position = lastToastIsVisible
      ? this.lastToast.getPosition().top
      : this.toastConfig.position.bottom

    return position + 'px'
  }

  getInjector(data: ToastData, toastRef: ToastRef, parentInjector: Injector): any {
    const tokens = new WeakMap()

    tokens.set(ToastData, data)
    tokens.set(ToastRef, toastRef)

    return new PortalInjector(parentInjector, tokens)
  }
}
