import { Component, Input } from '@angular/core';
import { TagDto } from '../dto/tag.dto';
import { Router } from '@angular/router';
import { join } from '@angular-devkit/core';

export interface Fruit {
  name: string;
}

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent{

  @Input('tags') tags: TagDto[] = []
  @Input('basePath') basePath = ''

  constructor(
    private readonly router: Router
  ){}

  redirectTo(id: number){
    console.log('/' + this.basePath + id)
    this.router.navigateByUrl('/' + this.basePath + id)
  }

}
