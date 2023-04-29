import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CapeTagDto } from '../dto/cape-tag.dto';

@Component({
  selector: 'app-create-tag',
  templateUrl: './create-tag.component.html',
  styleUrls: ['./create-tag.component.scss']
})
export class CreateTagComponent {

  @Input('capeTags') capeTags: CapeTagDto[] = []
  @ViewChild('tags') tags?: ElementRef<HTMLDivElement>

  getIdByTagsSelecteds(){
    if(this.tags == undefined)
      return

    const ids: number[] = []
    const inputs = Object.values(this.tags.nativeElement.children).map(({lastChild}) => lastChild) as HTMLInputElement[]

    inputs.forEach(({ dataset, checked }) => {
      const id = dataset['id']

      if(checked && id && !isNaN(+id))
        ids.push(+id)
    })

    return ids
  }

}
