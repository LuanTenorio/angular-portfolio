import { Component, Input } from '@angular/core';
import { ProjectsService } from '../projects.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ProjectCapeModel } from '../model/project-cape.model';
import { AbstractOrderDto } from '../../dto/abstract-order.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from '../../alert/alert.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {

  @Input('isPanel') isPanel = false
  isChangeOrder = false
  skillWasModified = false
  originalOrderCapes: ProjectCapeModel[] = []

  constructor(
    public readonly projectsService: ProjectsService,
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
      this.originalOrderCapes = [...this.projectsService.projectsCape]
      return
    }

    const coursesOrder: AbstractOrderDto = {
      models: this.projectsService.projectsCape.map(({id}, i) => {return {id, order: i + 1}})
    }

    this.projectsService.patchOrder(coursesOrder).subscribe(
      ({capes}) => {
        this.projectsService.projectsCape = capes
        console.log(capes)
      },
      (error: HttpErrorResponse) => {
        this.alertsService.addAlert('Erro ao editar ordem das habilidades')
        this.projectsService.projectsCape = this.originalOrderCapes
      }
    )
  }

}
