import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login/login.component';
import { PageComponent } from './page/page.component';
import { SkillComponent } from './skills/skill/skill.component';
import { AddSkillComponent } from './skills/add-skill/add-skill.component';
import { AddProjectComponent } from './projects/add-project/add-project.component';
import { ProjectComponent } from './projects/project/project.component';

const routes: Routes = [
  {path: '', component: PageComponent, data: {isPanel: false}},
  {path: 'painel', component: PageComponent, data: {isPanel: true}},
  {path: 'habilidade/:id', component: SkillComponent},
  {path: 'projeto/:id', component: ProjectComponent},
  {path: 'painel/adicionar/habilidade', component: AddSkillComponent},
  {path: 'painel/adicionar/projeto', component: AddProjectComponent},
  {path: 'login', component: LoginComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
