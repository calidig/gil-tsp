import { Component, Inject, OnDestroy, OnInit } from '@angular/core'
import { ToastRef } from '../../models/toast-ref'
import { toastAnimations, ToastAnimationState } from '../../animations/snackAnimation'
import { TOAST_CONFIG_TOKEN, ToastConfig, ToastData } from '../../models/toast-config'

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss'],
  animations: [toastAnimations.fadeToast]
})
export class SnackBarComponent implements OnInit, OnDestroy {
  animationState: ToastAnimationState = 'default'
  color: string

  private intervalId: number

  private colorDict = {
    success: 'rgba(161, 255, 161, 0.84)',
    warning: 'rgba(238,78,78,0.68)',
    info: '#FFF'
  }

  constructor(
    readonly data: ToastData,
    readonly ref: ToastRef,
    @Inject(TOAST_CONFIG_TOKEN) public toastConfig: ToastConfig
  ) {
    this.color = this.colorDict[data.type]
  }

  ngOnInit(): void {
    this.intervalId = setTimeout(() => this.animationState = 'closing', 2000)
  }

  ngOnDestroy(): void {
    clearTimeout(this.intervalId)
  }

  close(): void {
    this.ref.close()
  }

  onFadeFinished(event: AnimationEvent): void {
    // @ts-ignore
    const { toState } = event
    const isFadeOut = (toState as ToastAnimationState) === 'closing'
    const itFinished = this.animationState === 'closing'

    if (isFadeOut && itFinished) {
      this.close()
    }
  }
}
