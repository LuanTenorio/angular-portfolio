import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CapeTagDto } from '../dto/cape-tag.dto';

export interface Fruit {
  name: string;
}

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent{

  @Input('capeTags') capeTags: CapeTagDto[] = []
  @ViewChild('#tags') tags?: HTMLDivElement
  @Output() getIdsEvent = new EventEmitter<number[]>()

  getIds(){
    const fields = this.tags?.children as HTMLDivElement[] | undefined
    const ids: number[] = []
    fields?.forEach(div => {
      const input = div.children[1] as HTMLInputElement
      const id = input.getAttribute('data-id')
      if(input.checked && id !== null)
        ids.push(+id)
    })
    this.getIdsEvent.emit(ids)
  }

}
