import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SkillsService } from '../skills.service';
import { ImageDto } from '../../dto/image.dto';
import { ActivatedRoute, Router } from '@angular/router';
import { SkillModel } from '../model/skill.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Location } from '@angular/common';
import { AlertService } from '../../alert/alert.service';
import { isImageFile } from '../../util/is-image-file.util'
import { CoursesService } from '../../courses/courses.service';
import { ProjectsService } from '../../projects/projects.service';
import { CreateTagComponent } from '../../tag/create-tag/create-tag.component';
import { selectTag } from '../../tag/util/select-tag.util'
import { SkillPatchCacheJoinTablesDto } from '../dto/skill-patch-cache-join-tables.dto';

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
  selectTag = selectTag
  @ViewChild('coursesTag') courseTag?: CreateTagComponent
  @ViewChild('projectsTag') projectTag?: CreateTagComponent

  constructor(
    private readonly fb: FormBuilder,
    private readonly skillsService: SkillsService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly location: Location,
    private readonly router: Router,
    private readonly alertService: AlertService,
    public readonly coursesService: CoursesService,
    public readonly projectsService: ProjectsService,
  ){
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
            this.router.navigate(['/painel'])
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
    if(!this.form.valid || (!this.isEditable && this.image == undefined))
      return this.alertService.addAlert('Formulário invalido')

    this.loading = true
    const form = new FormData()
    for(const key of Object.keys(this.form.value))
      form.append(key, this.form.value[key])

    const [coursesId, projectsId] = [this.getCoursesId(), this.getProjectsId()]

    if(this.image !== undefined)
      form.append('_file_image', this.image.file, this.image.file.name)

    return !this.isEditable ? this.create(form, coursesId, projectsId) : this.patch(form, coursesId, projectsId)
  }

  private create(form: FormData, coursesId?: number[], projectsId?: number[]){
    if(this.image == undefined)
      return

    if(coursesId && coursesId.length > 0)
      form.append('coursesId', JSON.stringify(coursesId))

    if(projectsId && projectsId.length > 0)
      form.append('projectsId', JSON.stringify(projectsId))

    this.skillsService.addSkill(form).subscribe(
      ({skill}) => {
        this.loading = false
        this.skillsService.addSkillInArray(skill)
        this.patchCacheJoinTables(skill.id, {
          addCoursesIds: coursesId,
          addProjectsIds: projectsId
        })
        this.router.navigate(['/painel'])
      },
      (error: HttpErrorResponse) => {
        this.loading = false
        this.alertService.addAlert('Erro ao criar Habilidade')
      }
    )
  }

  private patch(form: FormData, addCoursesId?: number[], addProjectsId?: number[]){
    if(this.skill == undefined)
      return

    const { coursesId, deleteCoursesId, deleteProjectsId, projectsId } = this.addTagInPatch(form, addCoursesId, addProjectsId)
    form.append('editImage', JSON.stringify(this.image !== undefined))
    const joinsIds: SkillPatchCacheJoinTablesDto = {addCoursesIds: coursesId, addProjectsIds: projectsId, deletedCoursesIds: deleteCoursesId, deletedProjectsIds: deleteProjectsId}

    this.skillsService.patchSkill(form, this.skill.id).subscribe(
      ({skill}) => {
        this.loading = false
        this.skillsService.updateSkillInArray(skill)
        this.patchCacheJoinTables(skill.id, joinsIds)
        this.router.navigate(['/painel'])
      },
      (error: HttpErrorResponse) => {
        this.loading = false
        this.alertService.addAlert('Erro ao editar Habilidade')
      }
    )
  }

  private addTagInPatch(form: FormData, addCoursesId?: number[], addProjectsId?: number[]){
    const deleteCoursesId: number[] = []
    const deleteProjectsId: number[] = []
    const coursesId: number[] = []
    const projectsId: number[] = []

    addCoursesId = addCoursesId?.filter(id => {
      if(this.skill?.skillCourse.indexOf(id) === -1)
        coursesId.push(id)
      return this.skill?.skillCourse.indexOf(id) !== -1
    })

    this.skill?.skillCourse.forEach(id => {
      if(addCoursesId?.indexOf(id) === -1)
        deleteCoursesId.push(id)
    })

    addProjectsId = addProjectsId?.filter(id => {
      if(this.skill?.skillProject.indexOf(id) === -1)
        projectsId.push(id)
      return this.skill?.skillProject.indexOf(id) !== -1
    })

    this.skill?.skillProject.forEach(id => {
      if(addProjectsId?.indexOf(id) === -1)
        deleteProjectsId.push(id)
    })

    const tags = {deleteCoursesId, deleteProjectsId, coursesId, projectsId}

    for(const [key, tag] of Object.entries(tags))
      if(tag && tag.length > 0)
        form.append(key, JSON.stringify(tag))

    return tags
  }

  delete(){
    if(this.skill == undefined)
      return

    this.loading = true
    const id = this.skill.id

    this.skillsService.deleteSkill(id).subscribe(
      () => {
        this.loading = false
        this.deleteCacheJoinTables(id)
        this.skillsService.deleteSkillInArray(id)
        this.router.navigate(['/painel'])
      },
      (error: HttpErrorResponse) => {
        this.loading = false
        this.alertService.addAlert('Erro ao deletar Habilidade')
      }
    )
  }

  private async patchCacheJoinTables(skillId: number,  { addCoursesIds, addProjectsIds, deletedCoursesIds, deletedProjectsIds }: SkillPatchCacheJoinTablesDto){
    const cousesIds = [...addCoursesIds ?? [], ...deletedCoursesIds ?? []]
    let repeatedIds: number[] = []

    for(const id of cousesIds){
      if(repeatedIds.indexOf(id) !== -1)
        continue

      repeatedIds.push(id)
      const course = this.coursesService.courses.find(course => course.id == id)
      if(!course)
        continue

      if(deletedCoursesIds !== undefined && deletedCoursesIds.indexOf(id) !== -1)
        course.skillCourse = course.skillCourse.filter(courseId => courseId !== skillId)
      else if(addCoursesIds !== undefined && addCoursesIds.indexOf(id) !== -1)
        course.skillCourse.push(skillId)
    }

    const projectsIds = [...addProjectsIds ?? [], ...deletedProjectsIds ?? []]
    repeatedIds = []

    for(const id of projectsIds){
      if(repeatedIds.indexOf(id) !== -1)
        continue

      repeatedIds.push(id)
      const project = await this.projectsService.projects.find(project => project.id == id)
      if(!project)
        continue

      if(deletedProjectsIds !== undefined && deletedProjectsIds.indexOf(id) !== -1)
        project.skillProject = project.skillProject.filter(skillId => skillId !== skillId)
      else if(addProjectsIds !== undefined && addProjectsIds.indexOf(id) !== -1)
        project.skillProject.push(skillId)
    }
  }

  private async deleteCacheJoinTables(skillId: number){
    if(!this.skill)
      return

    for(const id of this.skill.skillCourse){
      const course = this.skillsService.skills.find(course => course.id == id)
      if(course)
        course.skillCourse = course.skillCourse.filter(courseId => courseId !== skillId)
    }

    for(const id of this.skill.skillProject){
      const project = this.projectsService.projects.find(project => project.id == id)
      if(project)
        project.skillProject = project.skillProject.filter(projectId => projectId !== projectId)
    }
  }

  setIsDropping = (value: boolean) => this.isDroping = value
  onFileSelected = (event: any) => this.setImage(event.target.files[0])

  private getCoursesId(){
    return this.courseTag?.getIdByTagsSelecteds()
  }

  private getProjectsId(){
    return this.projectTag?.getIdByTagsSelecteds()
  }

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
    if(!isImageFile(file)){
      this.alertService.addAlert('Adicione uma imagem')
      return
    }

    const reader = new FileReader();
    reader.readAsDataURL(file)
    reader.onload = () => {
      const preview = reader.result
      if(typeof preview == 'string')
        this.image = {file, preview}
    }
  }

}