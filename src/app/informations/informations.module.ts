import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InformationsComponent } from './informations/informations.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    InformationsComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MatSidenavModule
  ],
  exports: [
    InformationsComponent
  ]
})
export class InformationsModule { }
