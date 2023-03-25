export interface CreateProjectDto {
    name: string,
    shortDescription: string,
    description: string,
    linkLayout?: string,
    linkProject?: string,
    linkGithub?: string
    images: string[]
    coursesId?: number[]
    skillsId?: number[]
}