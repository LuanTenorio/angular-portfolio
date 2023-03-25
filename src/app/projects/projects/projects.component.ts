import { Component, Input } from '@angular/core';
import { ProjectsService } from '../projects.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {

  @Input('isPanel') isPanel = false

  constructor(
    public readonly projectsService: ProjectsService
  ){}

}
