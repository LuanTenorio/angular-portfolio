import { Component } from '@angular/core';
import { InformationsService } from '../informations/informations.service';
import { PageService } from './page.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent {

  constructor(
    private readonly pageService: PageService
  ){
    console.log('pageeeeeeeeeee');

  }

}
