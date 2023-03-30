import { Component, Input } from '@angular/core';
import { InformationsService } from '../informations.service';
import { ActivatedRoute } from '@angular/router';
import { ProjectsService } from '../../projects/projects.service'
import { SkillsService } from '../../skills/skills.service'
import { CoursesService } from '../../courses/courses.service'
import { yearsSinceUtil } from '../../util/years-since.util'

@Component({
  selector: 'app-informations',
  templateUrl: './informations.component.html',
  styleUrls: ['./informations.component.scss']
})
export class InformationsComponent {

  @Input('isPanel') isPanel: boolean = false
  year = yearsSinceUtil(new Date('2020-04-03'))

  constructor(
    public readonly informationService: InformationsService,
    private readonly route: ActivatedRoute,
    public readonly projectsService: ProjectsService,
    public readonly skillService: SkillsService,
    public readonly coursesService: CoursesService
  ){
    this.isPanel = this.route.snapshot.data['isPanel'] ?? false
  }


}
