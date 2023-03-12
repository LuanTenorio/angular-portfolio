import { Injectable } from '@angular/core';
import { InformationsService } from '../informations/informations.service';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  loaded = false

  constructor(
    private readonly informationService: InformationsService
  ){
    this.loadInitialRequests().subscribe(requests => {
      this.loaded = true
    })
  }

  loadInitialRequests(){
    const requests = [
      this.informationService.getInformations()
    ]

    return forkJoin(requests)
  }

}
