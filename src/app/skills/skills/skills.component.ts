import { Component, Input, OnInit } from '@angular/core';
import { SkillsService } from '../skills.service';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {

  @Input('isPanel') isPanel: boolean = false

  constructor(
    public readonly skillService: SkillsService
  ){}

  ngOnInit(){
    console.log(this.isPanel)
  }

}
