import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SkillsService } from '../skills.service';
import { SkillModel } from '../model/skill.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.scss']
})
export class SkillComponent {

  skill?: SkillModel
  loaded = false

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly skillsService: SkillsService
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
          this.loaded = true
        }
      )
    else{
      this.loaded = true
      this.skill = skillBySkills
    }
  }
}
