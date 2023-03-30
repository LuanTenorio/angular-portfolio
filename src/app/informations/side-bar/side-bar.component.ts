import { Component } from '@angular/core';
import { InformationsService } from '../informations.service';
import { ActivatedRoute } from '@angular/router';
import { PageService } from '../../page/page.service';
import { clearStringUtil } from '../../util/clear-string.util';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent {

  navigations = [
    'Sobre mim',
    'Habilidades',
    'Cursos',
    'Projetos',
  ]

  isEdit = false
  clearString = clearStringUtil
  scrollTo = (component: string) => this.pageService.scrollTo.next(component)

  constructor(
    public readonly informationService: InformationsService,
    private readonly route: ActivatedRoute,
    private readonly pageService: PageService
  ){
    this.isEdit = this.route.snapshot.data['isPanel'] ?? false
  }
}
