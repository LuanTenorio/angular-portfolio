import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SkillsService } from '../skills.service';
import { ImageDto } from '../../dto/image.dto';
import { ActivatedRoute, Router } from '@angular/router';
import { SkillModel } from '../model/skill.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Location } from '@angular/common';
import { AlertService } from '../../alert/alert.service';

@Component({
  selector: 'app-add-skill',
  templateUrl: './add-skill.component.html',
  styleUrls: ['./add-skill.component.scss']
})
export class AddSkillComponent {

  form: FormGroup
  image?: ImageDto
  isDroping = false
  isEditable: boolean = this.activatedRoute.snapshot.data['isEditable'] ?? false
  skill?: SkillModel
  loaded = false
  loading = false

  constructor(
    private readonly fb: FormBuilder,
    private readonly skillsService: SkillsService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly location: Location,
    private readonly router: Router,
    private readonly alertService: AlertService,
  ){
    console.log(this.image !== undefined ? this.image?.preview : this.skill?.pathImage)
    setInterval(() => {
      // console.log(this.image?.preview)
      // console.log(this.skill?.pathImage)
      console.log(this.image !== undefined ? this.image?.preview : this.skill?.pathImage)
    }, 100)

    this.form = fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      link: ['']
    })

    if(this.isEditable){
      const id: number = this.activatedRoute.snapshot.params['id']
      const skillBySkills = this.skillsService.skills.find(skill => skill.id == id)
      if(!skillBySkills && !!id)
        this.skillsService.getSkill(id).subscribe(
          ({skill}) => {
            this.skill = skill
            this.updateForm()
            this.loaded = true
          },
          (error: HttpErrorResponse) => {
            const indexCape = this.skillsService.capeOfSkills.findIndex(cape => id == cape.id)
            if(indexCape !== -1)
              this.skillsService.capeOfSkills.splice(indexCape, 1)
            this.location.back()
            this.alertService.addAlert('Essa habilidade Já foi deletada')
            this.loaded = true
          }
        )
      else{
        this.skill = skillBySkills
        this.updateForm()
        this.loaded = true
      }
    }
  }

  updateForm(){
    if(this.skill !== undefined)
      for(const key of Object.keys(this.form.value))
        this.form.controls[key].setValue(this.skill[key as keyof SkillModel])
  }

  save(){
    console.log('save')
    if(this.form.valid && this.image !== undefined && !this.isEditable){
      this.loading = true
      const form = new FormData()
      for(const key of Object.keys(this.form.value))
        form.append(key, this.form.value[key])

      form.append('_file_image', this.image.file, this.image.file.name)

      this.skillsService.addSkill(form).subscribe(
        ({skill}) => {
          this.loading = false
          this.skillsService.addSkillInArray(skill)
          this.router.navigate(['/painel'])
        },
        (error: HttpErrorResponse) => {
          this.loading = false
          this.alertService.addAlert('Erro ao criar Habilidade')
        }
      )
    }

    if(this.form.valid && this.isEditable && this.skill !== undefined){
      const form = new FormData()
      for(const key of Object.keys(this.form.value))
        form.append(key, this.form.value[key])

      if(this.image !== undefined)
        form.append('_file_image', this.image.file, this.image.file.name)

      form.append('editImage', JSON.stringify(this.image !== undefined)) 

      console.log(this.image)
      console.log(form)

      this.skillsService.patchSkill(form, this.skill.id).subscribe(
        ({skill}) => {
          this.loading = false
          this.skillsService.updateSkillInArray(skill)
          this.router.navigate(['/painel'])
        },
        (error: HttpErrorResponse) => {
          this.loading = false
          this.alertService.addAlert('Erro ao editar Habilidade')
        }
      )
    }

    if(!this.form.valid || (!this.isEditable && this.image == undefined))
      this.alertService.addAlert('Formulário invalido')
  }

  delete(){
    if(this.skill == undefined)
      return

    this.loading = true

    this.skillsService.deleteSkill(this.skill.id).subscribe(
      ({deleted}) => {
        if(!deleted)
          return

        this.loading = false
        this.skillsService.deleteSkillInArray(this.skill!.id)
      },
      (error: HttpErrorResponse) => {
        this.loading = false
        this.alertService.addAlert('Erro ao deletar Habilidade')
      }
    )
  }

  setIsDropping = (value: boolean) => this.isDroping = value
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