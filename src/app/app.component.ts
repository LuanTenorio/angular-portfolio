import { Component } from '@angular/core';
import { WindowOnResize, windowOnResize } from './util/window-on-resize.util';
import { PageService } from './page/page.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    public readonly pageService: PageService,
    public readonly router: Router,
  ){
    pageService.setStatusBar.subscribe(this.closeSideBar)
  }

  sidenavType: 'side' | 'over' = window.innerWidth <= 540 ? 'over' : 'side'
  hasBackdrop = window.innerWidth <= 540
  sidenavOpened = !this.hasBackdrop

  setSideBarOptions(value: boolean){
    this.sidenavType = value ? 'over' : 'side'
    this.hasBackdrop = value

    this.sidenavOpened = !value
  }

  closeSideBar(value: boolean){
    this.sidenavOpened = value
  }

}
