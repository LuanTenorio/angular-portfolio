import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InformationsComponent } from './informations/informations.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SideBarComponent } from './side-bar/side-bar.component';

@NgModule({
  declarations: [
    InformationsComponent,
    SideBarComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MatSidenavModule
  ],
  exports: [
    InformationsComponent,
    SideBarComponent
  ]
})
export class InformationsModule { }
