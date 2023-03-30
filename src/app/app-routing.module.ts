import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login/login.component';
import { PageComponent } from './page/page.component';
import { SkillComponent } from './skills/skill/skill.component';
import { AddSkillComponent } from './skills/add-skill/add-skill.component';
import { AddProjectComponent } from './projects/add-project/add-project.component';
import { ProjectComponent } from './projects/project/project.component';
import { AddCourseComponent } from './courses/add-course/add-course.component'
import { CourseComponent } from './courses/course/course.component';

const routes: Routes = [
  {path: '', component: PageComponent, data: {isPanel: false}},
  {path: 'painel', component: PageComponent, data: {isPanel: true}},
  {path: 'habilidade/:id', data: {isEditable: false}, component: SkillComponent},
  {path: 'projeto/:id', data: {isEditable: false}, component: ProjectComponent},
  {path: 'curso/:id', data: {isEditable: false}, component: CourseComponent},
  {path: 'painel/editar/habilidade/:id', data: {isEditable: true}, component: SkillComponent},
  {path: 'painel/editar/projeto/:id', data: {isEditable: true}, component: ProjectComponent},
  {path: 'painel/editar/curso/:id', data: {isEditable: true}, component: CourseComponent},
  {path: 'painel/adicionar/habilidade', component: AddSkillComponent},
  {path: 'painel/adicionar/projeto', component: AddProjectComponent},
  {path: 'painel/adicionar/curso', component: AddCourseComponent},
  {path: 'login', component: LoginComponent},
  {path: '**', redirectTo: ''},
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
