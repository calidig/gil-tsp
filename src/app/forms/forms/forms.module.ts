import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { FormInputComponent } from './components/form-input/form-input.component'
import { FormFieldComponent } from './components/form-field/form-field.component'
import { FormLabelComponent } from './components/form-label/form-label.component'
import { FormCheckboxComponent } from './components/form-checkbox/form-checkbox.component'
import { IconsModule } from '../../icons/icons.module'
import { FormErrorComponent } from './components/form-error/form-error.component'


@NgModule({
  declarations: [FormInputComponent, FormFieldComponent, FormLabelComponent, FormCheckboxComponent, FormErrorComponent],
  exports: [
    FormFieldComponent,
    FormLabelComponent,
    FormCheckboxComponent,
    FormErrorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IconsModule
  ]
})
export class CustomFormsModule {
}
