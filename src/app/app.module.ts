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
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AddTokenInterceptor } from './interceptors/add-token.interceptor';
import { UpdateTokenInterceptor } from './interceptors/update-token.interceptor';
import { RouterModule } from '@angular/router';
import { NgxFileDropModule } from 'ngx-file-drop';
import { AlertModule } from './alert/alert.module';
import { PageModule } from './page/page.module';
import { MatChipsModule } from '@angular/material/chips';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
  declarations: [
    AppComponent,
    PageComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    HttpClientModule,
    AppRoutingModule,
    MatChipsModule,
    LoginModule,
    InformationsModule,
    ProjectsModule,
    AlertModule,
    SkillsModule,
    CoursesModule,
    NgxFileDropModule,
    PageModule,
    MatSidenavModule,
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
export class AppModule {}
