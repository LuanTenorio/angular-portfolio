import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  loadingRequest: number[] = []
  private lastIndex = 0

  isLoading = false
  setLoading = (value: boolean) => this.isLoading = value

  private addIndex = () => this.lastIndex++

  addLoadingRequest(){
    this.addIndex()
    this.loadingRequest.push(this.lastIndex)
    console.log(this.loadingRequest);
    this.isLoading = true

    return this.lastIndex
  }

  removeLoadingRequest(spinnerId: number){
    console.log(this.loadingRequest);
    const index = this.loadingRequest.findIndex(number => number == spinnerId)
    if(index !== -1)
      this.loadingRequest.splice(index, 1)

    this.isLoading = this.loadingRequest.length !== 0
  }

  clearRequests(){
    this.isLoading = false
    this.loadingRequest = []
  }

}
