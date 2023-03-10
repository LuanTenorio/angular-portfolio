import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InformationsModule } from './informations/informations.module';
import { LoginModule } from './login/login.module';
import { ProjectsModule } from './projects/projects.module';
import { SkillsModule } from './skills/skills.module';
import { CoursesModule } from './courses/courses.module';
import { PageComponent } from './page/page.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AddTokenInterceptor } from './interceptors/add-token.interceptor';
import { UpdateTokenInterceptor } from './interceptors/update-token.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    PageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LoginModule,
    InformationsModule,
    ProjectsModule,
    SkillsModule,
    CoursesModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AddTokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UpdateTokenInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
