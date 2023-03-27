import { Component, Input } from '@angular/core';
import { CoursesService } from '../courses.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent {

  @Input('isPanel') isPanel = false

  constructor(
    public readonly coursesService: CoursesService
  ){}

}
