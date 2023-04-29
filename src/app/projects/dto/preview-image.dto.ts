import { ProjectImageModel } from "../model/project-image.model"

export interface PreviewImage {
    file?: File,
    preview: string
    imageModel?: ProjectImageModel
}