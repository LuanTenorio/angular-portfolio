import { Component, Input, OnInit } from '@angular/core';
import { SkillsService } from '../skills.service';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent {

  @Input('isPanel') isPanel: boolean = false

  constructor(
    public readonly skillService: SkillsService
  ){}

}
