import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InformationsComponent } from './informations/informations.component';



@NgModule({
  declarations: [
    InformationsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    InformationsComponent
  ]
})
export class InformationsModule { }
