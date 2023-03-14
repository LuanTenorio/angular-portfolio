import { Injectable } from '@angular/core';
import { InformationsService } from '../informations/informations.service';
import { forkJoin } from 'rxjs';
import { SkillsService } from '../skills/skills.service';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  loaded = false

  constructor(
    private readonly informationsService: InformationsService,
    private readonly skillsService: SkillsService
  ){
    this.loadInitialRequests().subscribe(requests => {
      this.loaded = true
    })
  }

  loadInitialRequests(){
    const requests = [
      this.informationsService.getInformations(),
      this.skillsService.getCapeOfSkills()
    ]

    return forkJoin(requests)
  }

}
