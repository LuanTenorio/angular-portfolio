import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectsService } from '../projects.service';
import { SpinnerService } from '../../page/spinner/spinner.service';
import { AlertService } from '../../alert/alert.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ImageDto } from '../../dto/image.dto';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent {

  form: FormGroup
  images: ImageDto[] = []
  isDroping = false

  constructor(
    private readonly fb: FormBuilder,
    private readonly projectsService: ProjectsService,
    private readonly spinnerService: SpinnerService,
    private readonly alertService: AlertService,
    private readonly router: Router
  ){
    this.form = fb.group({
      name: ['', [Validators.required]],
      shortDescription: ['', [Validators.required, Validators.max(255)]],
      description: ['', [Validators.required]],
      linkLayout: [''],
      linkProject: [''],
      linkGithub: ['']
    })
  }

  setIsDropping = (value: boolean) => this.isDroping = value

  save(){
    if(this.form.valid && this.images.length !== 0){
      const spinnerId = this.spinnerService.addLoadingRequest()
      const images = this.images.map(({preview}) => preview)
      const createProjectDto = {
        ...this.form.value,
        images
      }

      this.projectsService.addProject(createProjectDto).subscribe(
        ({project}) => {
          this.spinnerService.removeLoadingRequest(spinnerId)
          this.projectsService.projects.push(project)
          this.router.navigate(['/painel'])
        },
        (error: HttpErrorResponse) => {
          this.spinnerService.removeLoadingRequest(spinnerId)
          this.alertService.addAlert('Erro ao Criar Aviso')
        }
      )
    }else
      this.alertService.addAlert('Formulário invalido')
  }

  onFileSelected(event: any){
    for(const file of event.target.files)
      this.pushFile(file)
  }

  drop(event: any){
    event.preventDefault()
    this.setIsDropping(false)
    for(const file of event.dataTransfer.files)
      this.pushFile(file)
  }

  allowDrop(event: any) {
    event.preventDefault();
  }

  private pushFile(file: File){
    const reader = new FileReader();
    reader.readAsDataURL(file)
    reader.onload = () => {
      const preview = reader.result
      const index = this.images.findIndex(image => image.preview == preview)
      if(typeof preview == 'string' && index === -1)
        this.images.push({file, preview})
    }
  }

  deleteFile(index: number){
    this.images.splice(index, 1)
  }
}