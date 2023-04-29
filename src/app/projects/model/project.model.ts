import { ProjectImageModel } from "./project-image.model"

export interface ProjectModel {
    id: number
    name: string,
    order: number,
    description: string
    shortDescription: string
    linkLayout?: string
    linkProject?: string
    linkGithub?: string
    projectImage: ProjectImageModel[]
    skillProject: number[];
    courseProject: number[];
}