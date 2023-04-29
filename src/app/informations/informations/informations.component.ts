import { Component, Input } from '@angular/core';
import { InformationsService } from '../informations.service';
import { ActivatedRoute } from '@angular/router';
import { ProjectsService } from '../../projects/projects.service'
import { SkillsService } from '../../skills/skills.service'
import { CoursesService } from '../../courses/courses.service'
import { yearsSinceUtil } from '../../util/years-since.util'
import { AlertService } from '../../alert/alert.service';
import { PatchInformationDto } from '../dto/patch-information.dto'
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-informations',
  templateUrl: './informations.component.html',
  styleUrls: ['./informations.component.scss']
})
export class InformationsComponent {

  @Input('isPanel') isPanel: boolean = false
  year = yearsSinceUtil(new Date('2020-12-17'))

  constructor(
    public readonly informationService: InformationsService,
    private readonly route: ActivatedRoute,
    public readonly projectsService: ProjectsService,
    public readonly skillService: SkillsService,
    public readonly coursesService: CoursesService,
    private readonly alertService: AlertService,
  ){
    this.isPanel = this.route.snapshot.data['isPanel'] ?? false
  }

  onSubmitInput = this.patch

  sendPatch(event: any, attr: keyof PatchInformationDto){
    const text = event.target.innerText.trim()
    this.patch(text, attr)
  }

  private patch(text: string, attr: keyof PatchInformationDto){
    const form = new FormData()
    form.append(attr, text)
    if(this.informationService.information && text == this.informationService.information[attr])
      return

    this.informationService.patchInformations(form).subscribe(
      ({information}) => this.informationService.information = information,
      (error: HttpErrorResponse) => this.alertService.addAlert('Erro ao editar as informações')
    )
  }

}