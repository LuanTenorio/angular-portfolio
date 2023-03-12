import { Component } from '@angular/core';
import { InformationsService } from '../informations.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-informations',
  templateUrl: './informations.component.html',
  styleUrls: ['./informations.component.scss']
})
export class InformationsComponent {

  isEdit = false

  constructor(
    public readonly informationService: InformationsService,
    private readonly route: ActivatedRoute
  ){
    this.isEdit = this.route.snapshot.data['isPanel'] ?? false
  }


}
