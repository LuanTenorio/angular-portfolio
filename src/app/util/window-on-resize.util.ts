import { Observable, Subject } from "rxjs";

export interface WindowOnResize {
    sidenavType: 'over' | 'side'
    isMobile: boolean
}

const windowOnResize = new Subject<WindowOnResize>()

// window.onresize = (() => {
//     const isOver = window.innerWidth <= 540
//     const sidenavType = isOver ? 'over' : 'side'
//     const isMobile = isOver
//     console.log({sidenavType, isMobile})
//     console.log('windowOnResize nexttttttttttttttttttttttttttttttttttttt')
//     windowOnResize.next({sidenavType, isMobile})
// })

export { windowOnResize }