import { Component } from '@angular/core';
import { InformationsService } from '../informations.service';
import { ActivatedRoute } from '@angular/router';

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
    'Contato'
  ]

  isEdit = false

  constructor(
    public readonly informationService: InformationsService,
    private readonly route: ActivatedRoute
  ){
    this.isEdit = this.route.snapshot.data['isPanel'] ?? false
  }

}
