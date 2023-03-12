import { Component } from '@angular/core';
import { SkillsService } from '../skills.service';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent {

  constructor(
    public readonly skillService: SkillsService
  ){
    console.log(skillService.capeOfSkills);

  }

}
