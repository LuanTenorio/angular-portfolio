import { Injectable } from '@angular/core';
import { AlertDTO } from './dto/alert-dto';

@Injectable()
export class AlertService {

  alerts: AlertDTO[] = []
  private lastId = 0
  timeForDelete = 4500

  constructor() { }

  addAlert(warning: string, time?: number){
    const id = this.lastId
    this.alerts.push({ warning, id, time: time ?? this.timeForDelete })
    setTimeout(() => this.deleteAlert(id), time ?? this.timeForDelete)
    this.lastId++
  }

  deleteAlert(id: number){
    const index = this.alerts.findIndex(alert => alert.id == id)
    if(index !== -1)
      this.alerts.splice(index, 1)
  }

}
