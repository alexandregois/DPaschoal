import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { FormPayZenComponent } from './form-pay-zen.component';

@NgModule({
  declarations: [FormPayZenComponent],
  imports: [SharedModule],
  exports: [FormPayZenComponent],
})
export class FormPayZenModule {}
