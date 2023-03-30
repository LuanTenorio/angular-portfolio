import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SkillsService } from '../skills.service';
import { SkillModel } from '../model/skill.model';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from '../../alert/alert.service'

@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.scss']
})
export class SkillComponent {

  skill?: SkillModel
  loaded = false

  constructor(
    public readonly skillsService: SkillsService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly location: Location,
    private readonly alertService: AlertService
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
}
