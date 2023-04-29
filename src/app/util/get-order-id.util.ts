export function getOrderIdUtil<T extends {id: number}>(arr: T[]){
	return arr.map(({id}, index) => {return {id, order: index + 1}})
}