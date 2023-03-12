import { Component } from '@angular/core';
import { InformationsService } from '../informations.service';

@Component({
  selector: 'app-informations',
  templateUrl: './informations.component.html',
  styleUrls: ['./informations.component.scss']
})
export class InformationsComponent {

  constructor(
    public readonly informationService: InformationsService
  ){}
}
