import { InjectionToken, TemplateRef } from '@angular/core'

export class ToastData {
  type: ToastType
  text?: string
  template?: TemplateRef<any>
  templateContext?: {}
}

export type ToastType = 'warning' | 'info' | 'success'

export interface ToastConfig {
  position?: {
    bottom: number
    right: number
  }
  animation?: {
    fadeOut: number
    fadeIn: number
  }
}

export const defaultToastConfig: ToastConfig = {
  position: {
    bottom: 20,
    right: 20
  },
  animation: {
    fadeOut: 1500,
    fadeIn: 300
  }
}

export const TOAST_CONFIG_TOKEN = new InjectionToken('toast-config')
