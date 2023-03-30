import { Component } from '@angular/core';
import { InformationsService } from '../informations/informations.service';
import { PageService } from './page.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent {

  isPanel: boolean

  constructor(
    private readonly pageService: PageService,
    private readonly activatedRoute: ActivatedRoute
  ){
    this.isPanel = activatedRoute.snapshot.data['isPanel'] ?? false
    pageService.scrollTo.subscribe(this.scrollTo)
  }

  scrollTo(componentName: string){
    const component = document.getElementById(`${componentName}-component`)
    if(!component)
      return

    document.querySelector('main')?.scroll({
      top: component.offsetTop - 20,
      behavior: 'smooth'
    })
  }

}
