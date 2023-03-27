import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpinnerService } from '../../page/spinner/spinner.service';
import { AlertService } from '../../alert/alert.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ImageDto } from '../../dto/image.dto';
import { CoursesService } from '../courses.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent {

  form: FormGroup
  image?: ImageDto
  isDroping = false

  constructor(
    private readonly spinnerService: SpinnerService,
    private readonly fb: FormBuilder,
    private readonly coursesService: CoursesService,
    private readonly alertService: AlertService,
    private readonly router: Router,
    private readonly location: Location
  ){
    this.form = fb.group({
      name: ['', [Validators.required]],
      shortDescription: ['', [Validators.required]],
      description: ['', [Validators.required]],
      certificate: ['']
    })
  }

  setIsDropping = (value: boolean) => this.isDroping = value

  save(){
    if(this.form.valid && this.image !== undefined){
      this.spinnerService.setLoading(true)
      const images = this.image.preview
      const createProjectDto = {
        ...this.form.value,
        images
      }

      this.coursesService.addCourse(createProjectDto).subscribe(
        ({course}) => {
          this.spinnerService.setLoading(false)
          this.location.back()
        },
        (error: HttpErrorResponse) => {
          this.spinnerService.setLoading(false)
          this.alertService.addAlert('Erro ao adicionar curso')
        }
      )
    }else
      this.alertService.addAlert('Formulário invalido')
  }

  onFileSelected = (event: any) => this.setImage(event.target.files[0])

  drop(event: any){
    event.preventDefault()
    this.setIsDropping(false)
    for(const file of event.dataTransfer.files)
      this.setImage(file)
  }

  allowDrop(event: any) {
    event.preventDefault();
  }

  setImage(file: File){
    const reader = new FileReader();
    reader.readAsDataURL(file)
    reader.onload = () => {
      const preview = reader.result
      if(typeof preview == 'string')
        this.image = {file, preview}
    }
  }

}