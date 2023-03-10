import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login/login.component';
import { PageComponent } from './page/page.component';

const routes: Routes = [
  {path: '', component: PageComponent, data: {isPanel: false}},
  {path: 'painel', component: PageComponent, data: {isPanel: true}},
  {path: 'login', component: LoginComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
