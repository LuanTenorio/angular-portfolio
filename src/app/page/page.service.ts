import { Injectable } from '@angular/core';
import { InformationsService } from '../informations/informations.service';
import { forkJoin } from 'rxjs';
import { SkillsService } from '../skills/skills.service';
import { ProjectsService } from '../projects/projects.service';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  loaded = false

  constructor(
    private readonly informationsService: InformationsService,
    private readonly skillsService: SkillsService,
    private readonly projectsService: ProjectsService
  ){
    this.loadInitialRequests().subscribe(requests => {
      this.loaded = true
    })
  }

  loadInitialRequests(){
    const requests = [
      this.informationsService.getInformations(),
      this.skillsService.getCapeOfSkills(),
      this.projectsService.getProjects()
    ]

    return forkJoin(requests)
  }

}
