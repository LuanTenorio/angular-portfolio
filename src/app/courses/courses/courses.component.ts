import { Component, Input } from '@angular/core';
import { CoursesService } from '../courses.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CapeCourseModel } from '../model/cape-course.model';
import { AbstractOrderDto } from '../../dto/abstract-order.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from '../../alert/alert.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent {

  @Input('isPanel') isPanel = false
  isChangeOrder = false
  skillWasModified = false
  originalOrderCapes: CapeCourseModel[] = []

  constructor(
    public readonly coursesService: CoursesService,
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
      this.originalOrderCapes = [...this.coursesService.capeCourse]
      return
    }

    const coursesOrder: AbstractOrderDto = {
      models: this.coursesService.capeCourse.map(({id}, i) => {return {id, order: i + 1}})
    }

    this.coursesService.patchOrder(coursesOrder).subscribe(
      ({capes}) => {
        this.coursesService.capeCourse = capes
        console.log(capes)
      },
      (error: HttpErrorResponse) => {
        this.alertsService.addAlert('Erro ao editar ordem das habilidades')
        this.coursesService.capeCourse = this.originalOrderCapes
      }
    )
  }

}
