import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpinnerService } from '../../page/spinner/spinner.service';
import { AlertService } from '../../alert/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ImageDto } from '../../dto/image.dto';
import { CoursesService } from '../courses.service';
import { Location } from '@angular/common';
import { CourseModel } from '../model/course.model';
import { isImageFile } from '../../util/is-image-file.util';
import { selectTag } from '../../tag/util/select-tag.util';
import { SkillsService } from '../../skills/skills.service';
import { ProjectsService } from '../../projects/projects.service';
import { CreateTagComponent } from '../../tag/create-tag/create-tag.component';
import { CoursePatchCacheJoinTablesDto } from '../dto/course-patch-cache-join-tables.dto';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent {

  form: FormGroup
  image?: ImageDto
  course?: CourseModel
  isDroping = false
  isEditable: boolean = this.activatedRoute.snapshot.data['isEditable'] ?? false
  loading = false
  loaded = !this.isEditable
  selectTag = selectTag
  @ViewChild('skillsTag') skillsTag?: CreateTagComponent
  @ViewChild('projectsTag') projectsTag?: CreateTagComponent

  constructor(
    private readonly fb: FormBuilder,
    private readonly coursesService: CoursesService,
    private readonly alertService: AlertService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    public readonly skillsService: SkillsService,
    public readonly projectsService: ProjectsService,
  ){
    this.form = fb.group({
      name: ['', [Validators.required]],
      shortDescription: ['', [Validators.required]],
      description: ['', [Validators.required]],
      certificate: ['']
    })

    if(this.isEditable){
      const courseId: number = activatedRoute.snapshot.params['id']
      const curCourse = this.coursesService.courses.find(({id}) => id == courseId)
      if(!curCourse && !!courseId)
        this.coursesService.getCourse(courseId).subscribe(
          ({course}) => {
            this.course = course
            this.loaded = true
            this.updateForm()
          },
          (error: HttpErrorResponse) => {
            this.alertService.addAlert('Curso não encontrado')
            this.router.navigate(['/painel'])
          }
        )
      else{
        this.course = curCourse
        this.loaded = true
        this.updateForm()
      }
    }
  }

  updateForm(){
    if(this.course !== undefined && this.isEditable)
      for(const key of Object.keys(this.form.value))
        this.form.controls[key].setValue(this.course[key as keyof CourseModel])
  }

  setIsDropping = (value: boolean) => this.isDroping = value

  save(){
    if(this.form.invalid || (!this.isEditable && this.image == undefined)){
      this.alertService.addAlert('Formulário invalido')
      return
    }

    this.loading = true
    const form = new FormData()
    for(const key of Object.keys(this.form.value))
      form.append(key, this.form.value[key])

    const [skillsId, projectsId] = [this.skillsTag?.getIdByTagsSelecteds(), this.projectsTag?.getIdByTagsSelecteds()]

    if(this.image !== undefined)
      form.append('_file_cover', this.image.file, this.image.file.name)

    return !this.isEditable ? this.createCourse(form, skillsId, projectsId) : this.patchCourse(form, skillsId, projectsId)
  }

  private createCourse(form: FormData, skillsId?: number[], projectsId?: number[]){
    if(skillsId && skillsId.length > 0)
      form.append('skillsId', JSON.stringify(skillsId))

    if(projectsId && projectsId.length > 0)
      form.append('projectsId', JSON.stringify(projectsId))

    this.coursesService.addCourse(form).subscribe(
      ({course}) => {
        this.loading = false
        this.patchCacheJoinTables(course.id, {
          addProjectsIds: course.courseProject,
          addSkillsIds: course.skillCourse
        })
        this.coursesService.addCourseInArray(course)
        this.router.navigate(['/painel'])
      },
      (error: HttpErrorResponse) => {
        this.loading = false
        this.alertService.addAlert('Erro ao adicionar curso')
      }
    )
  }

  private patchCourse(form: FormData, addSkillsId?: number[], addProjectsId?: number[]){
    if(this.course == undefined)
      return

    form.append('updateImage', JSON.stringify(this.image !== undefined))
    const { projectsId, skillsId, deleteProjectsId, deleteSkillsId } = this.addTagInPatch(form, addSkillsId, addProjectsId)

    this.coursesService.patchCourse(form, this.course.id).subscribe(
      ({course}) => {
        this.loading = false
        this.patchCacheJoinTables(course.id, {
          addProjectsIds: projectsId,
          addSkillsIds: skillsId,
          deletedProjectsIds: deleteProjectsId,
          deletedSkillsIds: deleteSkillsId
        })
        this.coursesService.updateCourseInArray(course)
        this.router.navigate(['/painel'])
      },
      (error: HttpErrorResponse) => {
        this.loading = false
        this.alertService.addAlert('Erro ao editar curso')
      }
    )
  }

  private async patchCacheJoinTables(courseId: number,  { addProjectsIds, addSkillsIds, deletedProjectsIds, deletedSkillsIds }: CoursePatchCacheJoinTablesDto){
    const projectsIds = [...addProjectsIds ?? [], ...deletedProjectsIds ?? []]
    let repeatedIds: number[] = []

    for(const id of projectsIds){
      if(repeatedIds.indexOf(id) !== -1)
        continue

      repeatedIds.push(id)
      const project = this.projectsService.projects.find(project => project.id == id)
      if(!project)
        continue

      if(deletedProjectsIds !== undefined && deletedProjectsIds.indexOf(id) !== -1)
        project.courseProject = project.courseProject.filter(projectId => projectId !== courseId)
      else if(addProjectsIds !== undefined && addProjectsIds.indexOf(id) !== -1)
        project.courseProject.push(courseId)
    }

    const skillsIds = [...addSkillsIds ?? [], ...deletedSkillsIds ?? []]
    repeatedIds = []

    for(const id of skillsIds){
      if(repeatedIds.indexOf(id) !== -1)
        continue

      repeatedIds.push(id)
      const skill = this.skillsService.skills.find(skill => skill.id == id)
      if(!skill)
        continue

      if(deletedSkillsIds !== undefined && deletedSkillsIds.indexOf(id) !== -1)
        skill.skillCourse = skill.skillCourse.filter(skillId => skillId !== courseId)
      else if(addSkillsIds !== undefined && addSkillsIds.indexOf(id) !== -1)
        skill.skillCourse.push(courseId)
    }
  }

  private async deleteCacheJoinTables(courseId: number){
    if(!this.course)
      return

    for(const id of this.course.skillCourse){
      const skill = this.skillsService.skills.find(skill => skill.id == id)
      if(!skill)
        continue

      skill.skillCourse = skill.skillCourse.filter(skillId => skillId !== courseId)
    }

    for(const id of this.course.courseProject){
      const project = this.projectsService.projects.find(project => project.id == id)
      if(!project)
        continue

      project.courseProject = project.courseProject.filter(projectId => projectId !== courseId)
    }
  }

  private addTagInPatch(form: FormData, addSkillId?: number[], addProjectsId?: number[]){
    const deleteSkillsId: number[] = []
    const deleteProjectsId: number[] = []
    const skillsId: number[] = []
    const projectsId: number[] = []

    addSkillId = addSkillId?.filter(id => {
      if(this.course?.skillCourse.indexOf(id) === -1)
        skillsId.push(id)
      return this.course?.skillCourse.indexOf(id) !== -1
    })

    this.course?.skillCourse.forEach(id => {
      if(addSkillId?.indexOf(id) === -1)
        deleteSkillsId.push(id)
    })

    addProjectsId = addProjectsId?.filter(id => {
      if(this.course?.courseProject.indexOf(id) === -1)
        projectsId.push(id)
      return this.course?.courseProject.indexOf(id) !== -1
    })

    this.course?.courseProject.forEach(id => {
      if(addProjectsId?.indexOf(id) === -1)
        deleteProjectsId.push(id)
    })

    const tags = {deleteSkillsId, deleteProjectsId, skillsId, projectsId}

    for(const [key, tag] of Object.entries(tags))
      if(tag && tag.length > 0)
        form.append(key, JSON.stringify(tag))

    return tags
  }

  onFileSelected = (event: any) => this.setImage(event.target.files[0])

  delete(){
    if(this.course == undefined)
      return

    this.loading = true
    const id = this.course.id

    this.coursesService.deleteCourse(id).subscribe(
      ({deleted}) => {
        if(!deleted)
          return

        this.loading = false
        this.deleteCacheJoinTables(id)
        this.coursesService.deleteCourseInArray(id)
        this.router.navigate(['/painel'])
      },
      (error: HttpErrorResponse) => {
        this.loading = false
        this.alertService.addAlert('Erro ao deletar curso')
      }
    )
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