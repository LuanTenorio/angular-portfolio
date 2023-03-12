import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillsComponent } from './skills/skills.component';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { SkillComponent } from './skill/skill.component';

@NgModule({
  declarations: [
    SkillsComponent,
    SkillComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule
  ],
  exports: [
    SkillsComponent
  ]
})
export class SkillsModule { }
