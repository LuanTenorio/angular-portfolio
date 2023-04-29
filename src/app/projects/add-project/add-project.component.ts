import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../alert/alert.service';
import { SpinnerService } from '../../page/spinner/spinner.service';
import { ProjectsService } from '../projects.service';
import { ProjectModel } from '../model/project.model';
import { isImageFile } from '../../util/is-image-file.util';
import { PreviewImage } from '../dto/preview-image.dto';
import { selectTag } from '../../tag/util/select-tag.util';
import { CoursesService } from '../../courses/courses.service';
import { SkillsService } from '../../skills/skills.service';
import { CreateTagComponent } from '../../tag/create-tag/create-tag.component';
import { ProjectPatchCacheJoinTablesDto } from '../dto/patch-cache-join-tables.dto';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent {

  form: FormGroup
  images: PreviewImage[] = []
  isDroping = false
  project?: ProjectModel
  isEditable: boolean = this.activatedRoute.snapshot.data['isEditable'] ?? false
  loaded = !this.isEditable
  loading = false
  deletedImagesId: number[] = []
  selectTag = selectTag
  @ViewChild('skillsTag') skillsTag?: CreateTagComponent
  @ViewChild('coursesTag') coursesTag?: CreateTagComponent

  constructor(
    private readonly fb: FormBuilder,
    private readonly projectsService: ProjectsService,
    private readonly spinnerService: SpinnerService,
    private readonly alertService: AlertService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    public readonly coursesService: CoursesService,
    public readonly skillsService: SkillsService,
  ){
    this.form = fb.group({
      name: ['', [Validators.required]],
      shortDescription: ['', [Validators.required, Validators.max(255)]],
      description: ['', [Validators.required]],
      linkLayout: [''],
      linkProject: [''],
      linkGithub: ['']
    })

    if(this.isEditable){
      const projectId: number = activatedRoute.snapshot.params['id']
      const curProject = this.projectsService.projects.find(({id}) => id == projectId)
      if(!curProject && !!projectId)
        this.projectsService.getProject(projectId).subscribe(
          ({project}) => {
            this.project = project
            this.loaded = true
            this.updateForm()
          },
          (error: HttpErrorResponse) => {
            this.alertService.addAlert('Projeto não encontrado')
            this.router.navigate(['/painel'])
          }
        )
      else{
        this.project = curProject
        this.loaded = true
        this.updateForm()
      }
    }
  }

  updateForm(){
    if(this.project !== undefined && this.isEditable){
      for(const key of Object.keys(this.form.value))
        this.form.controls[key].setValue(this.project[key as keyof ProjectModel])

      const images: PreviewImage[] = this.project.projectImage.map(projectImage => {
        return {preview: projectImage.pathImage, imageModel: {...projectImage}}
      })

      this.images.unshift(...images)
      setTimeout(() => console.log(this.images), 1000)
    }
  }

  setIsDropping = (value: boolean) => this.isDroping = value

  save(){
    if(this.form.invalid || this.images.length == 0){
      this.alertService.addAlert('Formulário invalido')
      return
    }

    const [skillsId, coursesId] = [this.skillsTag?.getIdByTagsSelecteds(), this.coursesTag?.getIdByTagsSelecteds()]

    this.loading = true
    const form = new FormData()
    for(const key of Object.keys(this.form.value))
      form.append(key, this.form.value[key])

    return this.isEditable ? this.patchProject(form, skillsId, coursesId) : this.createProject(form, skillsId, coursesId)
  }

  private patchProject(form: FormData, addSkillId?: number[], addCourseId?: number[]){
    if(this.project == undefined)
      return

    let isAddedImages = false
    const { deleteSkillsId, deleteCoursesId, skillsId, coursesId } = this.addTagInPatch(form, addSkillId, addCourseId)
    const joinsIds = {addCoursesIds: coursesId, addSkillsIds: skillsId, deletedCoursesIds: deleteCoursesId, deletedSkillsIds: deleteSkillsId}
    const projectId = this.project.id

    this.images.forEach(image => {
      if(image.file){
        form.append('_file_images', image.file, image.file.name)
        isAddedImages = true
        return false
      }
      return true
    })

    form.append('isAddedImages', JSON.stringify(isAddedImages))

    if(this.deletedImagesId.length > 0)
      form.append('deleteImages', JSON.stringify(this.deletedImagesId))

    this.projectsService.patchProject(projectId, form).subscribe(
      ({project}) => {
        this.patchCacheJoinTables(projectId, joinsIds)
        this.projectsService.updateProjectInArray(project)
        this.loading = false
        this.router.navigate(['/painel'])
      },
      (error: HttpErrorResponse) => {
        console.log(error)
        this.loading = false
        this.alertService.addAlert('Erro ao Atualizar Projeto')
      }
    )
  }

  private async patchCacheJoinTables(projectId: number,  { addCoursesIds, addSkillsIds, deletedCoursesIds, deletedSkillsIds }: ProjectPatchCacheJoinTablesDto){
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
        course.courseProject = course.courseProject.filter(courseId => courseId !== projectId)

      else if(addCoursesIds !== undefined && addCoursesIds.indexOf(id) !== -1)
        course.courseProject.push(projectId)
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
        skill.skillProject = skill.skillProject.filter(skillId => skillId !== projectId)
      else if(addSkillsIds !== undefined && addSkillsIds.indexOf(id) !== -1)
        skill.skillProject.push(projectId)
    }
  }

  private async deleteCacheJoinTables(projectId: number){
    if(!this.project)
      return

    const project = this.project

    for(const id of project.courseProject){
      const course = this.coursesService.courses.find(course => course.id == id)
      if(course)
        course.courseProject = course.courseProject.filter(courseId => courseId !== projectId)
    }

    for(const id of project.skillProject){
      const skill = this.skillsService.skills.find(skillId => skillId.id == id)
      if(skill)
        skill.skillProject = skill.skillProject.filter(skillId => skillId !== projectId)
    }
  }

  private createProject(form: FormData, addSkillId?: number[], addCourseId?: number[]){
    if(addSkillId && addSkillId.length > 0)
      form.append('skillsId', JSON.stringify(addSkillId))

    if(addCourseId && addCourseId.length > 0)
      form.append('coursesId', JSON.stringify(addCourseId))

    for(const image of this.images)
      if(image.file)
        form.append('_file_images', image.file, image.file.name)

    this.projectsService.addProject(form).subscribe(
      ({project}) => {
        this.patchCacheJoinTables(project.id, {
          addCoursesIds: project.courseProject,
          addSkillsIds: project.skillProject
        })
        this.loading = false
        this.router.navigate(['/painel'])
      },
      (error: HttpErrorResponse) => {
        this.loading = false
        this.alertService.addAlert('Erro ao Criar Projeto')
      }
    )
  }

  deleteProject(){
    if(this.project == undefined)
      return

    this.loading = true

    const id = this.project.id

    this.projectsService.deleteProject(id).subscribe(
      ({deleted}) => {
        this.loading = false
        this.projectsService.deleteProjectInArray(id)
        this.deleteCacheJoinTables(id)
        this.router.navigate(['/painel'])
      },
      (error: HttpErrorResponse) => {
        this.loading = false
        this.alertService.addAlert('Erro ao Deletar Projeto')
      }
    )
  }

  private addTagInPatch(form: FormData, addSkillId?: number[], addCourseId?: number[]){
    const deleteSkillsId: number[] = []
    const deleteCoursesId: number[] = []
    const skillsId: number[] = []
    const coursesId: number[] = []

    addSkillId = addSkillId?.filter(id => {
      if(this.project?.skillProject.indexOf(id) === -1)
        skillsId.push(id)
      return this.project?.skillProject.indexOf(id) !== -1
    })

    this.project?.skillProject.forEach(id => {
      if(addSkillId?.indexOf(id) === -1)
        deleteSkillsId.push(id)
    })

    addCourseId = addCourseId?.filter(id => {
      if(this.project?.courseProject.indexOf(id) === -1)
        coursesId.push(id)
      return this.project?.courseProject.indexOf(id) !== -1
    })

    this.project?.courseProject.forEach(id => {
      if(addCourseId?.indexOf(id) === -1)
        deleteCoursesId.push(id)
    })

    const tags = {deleteSkillsId, deleteCoursesId, skillsId, coursesId}

    for(const [key, tag] of Object.entries(tags))
      if(tag && tag.length > 0)
        form.append(key, JSON.stringify(tag))

    return tags
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
    if(!isImageFile(file)){
      this.alertService.addAlert('Adicione uma imagem')
      return
    }

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const preview = reader.result
      const index = this.images.findIndex(image => image.preview == preview)
      if(typeof preview == 'string' && index === -1)
        this.images.push({file, preview})
    }
  }

  deleteFile(index: number){
    const id = this.images[index].imageModel?.id
    if(id)
      this.deletedImagesId.push(id)
    this.images.splice(index, 1)
  }
}