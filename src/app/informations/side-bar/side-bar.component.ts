import { Component } from '@angular/core';
import { InformationsService } from '../informations.service';

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

  constructor(
    public readonly informationService: InformationsService
  ){}

}
