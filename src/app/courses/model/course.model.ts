export interface CourseModel {
    id: number
    name: string
    shortDescription: string
    description: string
    pathImage: string
    certificate?: string
    order: number
}