import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagComponent } from './tag/tag.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CreateTagComponent } from './create-tag/create-tag.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    TagComponent,
    CreateTagComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    MatInputModule,
    MatChipsModule,
    MatFormFieldModule,
    MatOptionModule,
    MatAutocompleteModule,
    MatIconModule,
    RouterModule
  ],
  exports: [
    TagComponent,
    CreateTagComponent
  ]
})
export class TagModule { }
