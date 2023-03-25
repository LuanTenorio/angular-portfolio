import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArrowToBackComponent } from './arrow-to-back/arrow-to-back.component';
import { CarrosselComponent } from './carrossel/carrossel.component';
import { SpinnerComponent } from './spinner/spinner.component';

@NgModule({
  declarations: [
    ArrowToBackComponent,
    CarrosselComponent,
    SpinnerComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ArrowToBackComponent,
    CarrosselComponent,
    SpinnerComponent
  ]
})
export class PageModule { }
