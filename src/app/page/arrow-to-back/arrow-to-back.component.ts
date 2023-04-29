import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'arrow-to-back',
  templateUrl: './arrow-to-back.component.html',
  styleUrls: ['./arrow-to-back.component.scss']
})
export class ArrowToBackComponent {

  constructor(
    private readonly location: Location,
    private readonly router: Router
  ){}

  goBack() {
    const { navigationId } = this.location.getState() as {navigationId: number}
    const isPanel = this.router.url.indexOf('painel') !== -1

    return navigationId && navigationId !== 1 ?
      this.location.back() :
      this.router.navigateByUrl('/' + isPanel ? 'painel' : '')
  }
}
