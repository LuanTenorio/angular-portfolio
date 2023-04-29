import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SkillsService } from '../skills.service';
import { SkillModel } from '../model/skill.model';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from '../../alert/alert.service'
import { CoursesService } from '../../courses/courses.service';
import { ProjectsService } from '../../projects/projects.service';
import { filterTag } from '../../tag/util/filter-tag.uitl';

@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.scss']
})
export class SkillComponent {

  skill?: SkillModel
  loaded = false
  isEditable: boolean = this.activatedRoute.snapshot.data['isEditable'] ?? false
  filterTag = filterTag

  constructor(
    public readonly skillsService: SkillsService,
    public readonly coursesService: CoursesService,
    public readonly projectsService: ProjectsService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly location: Location,
    private readonly alertService: AlertService,
  ){
    const id: number = this.activatedRoute.snapshot.params['id']
    const skillBySkills = this.skillsService.skills.find(skill => skill.id == id)
    if(!skillBySkills && !!id)
      this.skillsService.getSkill(id).subscribe(
        ({skill}) => {
          this.skill = skill
          this.loaded = true
        },
        (error: HttpErrorResponse) => {
          const indexCape = this.skillsService.capeOfSkills.findIndex(cape => id == cape.id)
          console.log(indexCape)
          if(indexCape !== -1)
            this.skillsService.capeOfSkills.splice(indexCape, 1)
          this.location.back()
          this.alertService.addAlert('Essa habilidade Já foi deletada')
          this.loaded = true
        }
      )
    else{
      this.skill = skillBySkills
      this.loaded = true
    }
  }

  redirectToEdit(){
    const id: number = this.activatedRoute.snapshot.params['id']
    if(id && this.isEditable)
      this.router.navigate(['painel', 'editar', 'habilidade', id])
  }

}
