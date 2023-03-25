import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'arrow-to-back',
  templateUrl: './arrow-to-back.component.html',
  styleUrls: ['./arrow-to-back.component.scss']
})
export class ArrowToBackComponent {

  constructor(private location: Location) { }

  goBack() {
    this.location.back();
  }
}
