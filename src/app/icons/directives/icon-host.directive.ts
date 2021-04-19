import { Directive, ViewContainerRef } from '@angular/core'

@Directive({
  selector: '[appIconHost]'
})
export class IconHostDirective {

  constructor(public viewContainerRef: ViewContainerRef) {
  }

}
