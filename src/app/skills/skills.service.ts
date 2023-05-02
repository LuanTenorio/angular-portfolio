import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseCapeOfSkillsDto } from './dto/response-cape-of-skill.dto';
import { CapeOfSkillsModel } from './model/cape-of-skill.model';
import { catchError, map } from 'rxjs';
import { ResponseSkillDto } from './dto/response-skill.dto';
import { SkillModel } from './model/skill.model';
import { ResponseGenericDelete } from '../dto/response-generic-delete.dto';
import { AbstractOrderDto } from '../dto/abstract-order.dto';

@Injectable({
  providedIn: 'root'
})
export class SkillsService {

  API = '/api/skill/'

  loaded = false
  capeOfSkills: CapeOfSkillsModel[] = []
  skills: SkillModel[] = []

  constructor(
    private readonly http: HttpClient
  ) { }

  patchOrder = (skillsOrder: AbstractOrderDto) => this.http.patch<ResponseCapeOfSkillsDto>(this.API + 'order', skillsOrder)

  getCapeOfSkills = () => this.http.get<ResponseCapeOfSkillsDto>(this.API + 'capes/').pipe(
    map(
      ({capes}) => {
        console.log(capes);

        this.capeOfSkills = capes
        this.loaded = true
        return {capes}
      }
    ),
    catchError(
      (error: HttpErrorResponse) => {
        this.loaded = true
        return 'HttpErrorResponse'
      }
    )
  )

  addSkill = (createSkill: FormData) => this.http.post<ResponseSkillDto>(this.API, createSkill)
  patchSkill = (createSkill: FormData, skillId: number) => this.http.patch<ResponseSkillDto>(this.API + skillId, createSkill)
  getSkill = (skillId: number) => this.http.get<ResponseSkillDto>(this.API + skillId)
  deleteSkill = (skillId: number) => this.http.delete<ResponseGenericDelete>(this.API + skillId)

  addSkillInArray(skill: SkillModel){
    const indexSkill = this.skills.findIndex(({id}) => skill.id == id)
    if(indexSkill == -1)
      this.skills.push(skill)

    const lastOrder = this.capeOfSkills.at(-1)?.order
    const indexCape = this.capeOfSkills.findIndex(({id}) => id == skill.id)
    if(indexCape == -1)
      this.capeOfSkills.push({id: skill.id, name: skill.name, order: lastOrder ?? 1})
  }

  deleteSkillInArray(skillId: number){
    const indexSkill = this.skills.findIndex(({id}) => id == skillId)
    if(indexSkill !== -1)
      this.skills.splice(indexSkill, 1)

    const indexCape = this.capeOfSkills.findIndex(({id}) => id == skillId)
    if(indexCape !== -1)
      this.capeOfSkills.splice(indexCape, 1)
  }

  updateSkillInArray(skill: SkillModel){
    const index = this.skills.findIndex(({id}) => skill.id == id)
    if(index !== -1)
      this.skills[index] = skill
    else
      this.skills.push(skill)

    const indexCape = this.capeOfSkills.findIndex(({id}) => id == skill.id)
    if(indexCape !== -1)
      this.capeOfSkills[indexCape].name = skill.name
    else
      this.addSkillInArray(skill)
  }

}
