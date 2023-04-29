import { CapeTagDto } from '../dto/cape-tag.dto'

export function selectTag(capes: CapeTagDto[], ids: number[]){
    return capes.map(cape => {
        cape.selected = ids.indexOf(cape.id) !== -1
        return cape
    })
}