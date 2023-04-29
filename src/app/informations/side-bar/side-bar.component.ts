import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { InformationsService } from '../informations.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { PageService } from '../../page/page.service';
import { clearStringUtil } from '../../util/clear-string.util';
import { isImageFile } from '../../util/is-image-file.util';
import { AlertService } from '../../alert/alert.service';
import { ImageDto } from '../dto/image.dto';
import { PatchInformationDto } from '../dto/patch-information.dto';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  navigations = [
    'Sobre mim',
    'Habilidades',
    'Cursos',
    'Projetos',
  ]
  sidenavOpened = true
  @Output('closeSideBar') private closeSideBar = new EventEmitter<boolean>()
  @Output('changeScreen') private changeScreen = new EventEmitter<boolean>()

  image?: ImageDto
  isEdit = this.route.snapshot.data['isPanel'] ?? false
  clearString = clearStringUtil
  isMobile = window.innerWidth <= 540

  constructor(
    public readonly informationService: InformationsService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly pageService: PageService,
    private readonly alertService: AlertService,
  ){
    window.onresize = (() => {
      const windowIsMobile = window.innerWidth <= 540
      if(windowIsMobile !== this.isMobile)
        this.changeScreen.emit(windowIsMobile)

      this.isMobile = windowIsMobile
    })

    this.informationService.loadedObservable.subscribe(
      isLoaded => {
        if(isLoaded && this.informationService.information)
          this.image = {preview: this.informationService.information.image}
      }
    )
  }

  scrollTo(component: string){
    const folders = this.router.url.split('/').slice(1)
    if(folders.length > 1)
      this.router.navigate(['/', folders[0]]).then(() => {
        this.pageService.scrollTo.next(component)
        if(this.isMobile)
          this.pageService.setStatusBar.next(false)
      })
    else
      this.pageService.scrollTo.next(component)
  }

  ngOnInit(){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const folders = event.urlAfterRedirects.split('/').slice(1)
        this.isEdit = folders[0] == 'painel'
        console.log(this.isEdit)
      }
    })
  }

  sendPatch(event: any, attr: keyof PatchInformationDto){
    const text = event.target.innerText.trim()
    const form = new FormData()
    if(attr == 'image' && this.image?.file)
      form.append('_file_cover', this.image.file, this.image.file.name)
    else
      form.append(attr, text)

    if(this.informationService.information && (attr !== 'image' && text == this.informationService.information[attr]))
      return

    this.informationService.patchInformations(form).subscribe(
      ({information}) => {
        if(attr == 'image')
          this.image = {preview: information.image}
        this.informationService.information = information
      },
      (error: HttpErrorResponse) => this.alertService.addAlert('Erro ao editar as informações')
    )
  }

  onFileSelected = (event: any) => {
    this.setImage(event.target.files[0], () => {
      this.sendPatch(event, 'image')
    })
  }

  setImage(file: File, onLoadFile: () => void){
    if(!isImageFile(file)){
      this.alertService.addAlert('Adicione uma imagem')
      return
    }

    const reader = new FileReader();
    reader.readAsDataURL(file)
    reader.onload = () => {
      const preview = reader.result
      if(typeof preview == 'string')
        this.image = {file, preview}
      onLoadFile()
    }
  }

  closeSideBarEmitter(){
    this.closeSideBar.emit(false)
  }

}
