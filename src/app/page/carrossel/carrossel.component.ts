import { Component, Input, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-carrossel',
  templateUrl: './carrossel.component.html',
  styleUrls: ['./carrossel.component.scss']
})
export class CarrosselComponent implements OnInit, OnDestroy {

  @Input('paths') paths: string[] = []
  @ViewChild('carrossel') carrosselTag?: ElementRef<HTMLDivElement>
  intervalId: any;

  ngOnInit() {
    this.startInterval();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  startInterval() {
    if(this.paths.length >= 1)
      return

    this.intervalId = setInterval(() => {
      this.move(true)
    }, 4000);
  }

  move(next: boolean){
    const carrossel = this.carrosselTag?.nativeElement

    if(!carrossel)
      return

    clearInterval(this.intervalId);
    const { scrollLeft, firstChild, offsetWidth } = carrossel
    const sum = scrollLeft + offsetWidth * (next ? 1 : -1)

    carrossel.scroll({
      left: sum >= offsetWidth * this.paths.length ? 0 : sum,
      behavior: 'smooth'
    })

    this.startInterval();
  }
}