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
import { IsAuthenticatedGuard } from './guard/is-authenticated.guard';

const routes: Routes = [
  {path: '', component: PageComponent, data: {isPanel: false}},
  {path: 'painel', component: PageComponent, data: {isPanel: true}, canActivate: [IsAuthenticatedGuard]},
  {path: 'habilidade/:id', data: {isEditable: false}, component: SkillComponent},
  {path: 'projeto/:id', data: {isEditable: false}, component: ProjectComponent},
  {path: 'curso/:id', data: {isEditable: false}, component: CourseComponent},
  {path: 'painel/habilidade/:id', data: {isEditable: true}, component: SkillComponent, canActivate: [IsAuthenticatedGuard]},
  {path: 'painel/projeto/:id', data: {isEditable: true}, component: ProjectComponent, canActivate: [IsAuthenticatedGuard]},
  {path: 'painel/curso/:id', data: {isEditable: true}, component: CourseComponent, canActivate: [IsAuthenticatedGuard]},

  {path: 'painel/editar/habilidade/:id', data: {isEditable: true}, component: AddSkillComponent, canActivate: [IsAuthenticatedGuard]},
  {path: 'painel/editar/projeto/:id', data: {isEditable: true}, component: AddProjectComponent, canActivate: [IsAuthenticatedGuard]},
  {path: 'painel/editar/curso/:id', data: {isEditable: true}, component: AddCourseComponent, canActivate: [IsAuthenticatedGuard]},
  {path: 'painel/adicionar/habilidade', component: AddSkillComponent, canActivate: [IsAuthenticatedGuard]},
  {path: 'painel/adicionar/projeto', component: AddProjectComponent, canActivate: [IsAuthenticatedGuard]},
  {path: 'painel/adicionar/curso', component: AddCourseComponent, canActivate: [IsAuthenticatedGuard]},
  {path: 'login', component: LoginComponent},
  {path: '**', redirectTo: ''},
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
