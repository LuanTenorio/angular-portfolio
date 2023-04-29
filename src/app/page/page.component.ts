import { Component } from '@angular/core';
import { PageService } from './page.service';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent {

  isPanel: boolean = this.activatedRoute.snapshot.data['isPanel'] ?? false

  constructor(
    public readonly pageService: PageService,
    private readonly activatedRoute: ActivatedRoute
  ){
    pageService.scrollTo.pipe(delay(0)).subscribe(this.scrollTo)
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
