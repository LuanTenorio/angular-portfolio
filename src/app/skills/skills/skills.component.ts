import { Component, Input, OnInit } from '@angular/core';
import { SkillsService } from '../skills.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AbstractOrderDto } from '../../dto/abstract-order.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from '../../alert/alert.service';
import { CapeOfSkillsModel } from '../model/cape-of-skill.model';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent {

  @Input('isPanel') isPanel: boolean = false
  isChangeOrder = false
  skillWasModified = false
  originalOrderCapes: CapeOfSkillsModel[] = []

  constructor(
    public readonly skillService: SkillsService,
    private readonly alertsService: AlertService
  ){}

  drop(event: CdkDragDrop<string[]> | any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    this.skillWasModified = true
  }

  setChangeOrder(value: boolean){
    if(!this.isPanel)
      return

    this.isChangeOrder = value
    if(value){
      this.originalOrderCapes = [...this.skillService.capeOfSkills]
      return
    }

    const skillsOrder: AbstractOrderDto = {
      models: this.skillService.capeOfSkills.map(({id}, i) => {return {id, order: i + 1}})
    }

    this.skillService.patchOrder(skillsOrder).subscribe(
      ({capes}) => {
        this.skillService.capeOfSkills = capes
      },
      (error: HttpErrorResponse) => {
        this.alertsService.addAlert('Erro ao editar ordem das habilidades')
        this.skillService.capeOfSkills = this.originalOrderCapes
      }
    )
  }

}
