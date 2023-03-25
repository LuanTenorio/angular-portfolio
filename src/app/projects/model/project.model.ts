import { ProjectImageModel } from "./project-image.model"

export interface ProjectModel {
    id: number
    name: string
    description: string
    linkLayout?: string
    linkProject?: string
    linkGithub?: string
    projectImage: ProjectImageModel[]
}