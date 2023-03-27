import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillsComponent } from './skills/skills.component';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { SkillComponent } from './skill/skill.component';
import { AddSkillComponent } from './add-skill/add-skill.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PageModule } from '../page/page.module';

@NgModule({
  declarations: [
    SkillsComponent,
    SkillComponent,
    AddSkillComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    RouterModule,
    PageModule,
  ],
  exports: [
    SkillsComponent
  ]
})
export class SkillsModule { }
