export function filterTag<T extends {id: number}>(capes: T[], arrIds: number[]){
    return capes.filter(({id}) => arrIds.indexOf(id) !== -1)
}