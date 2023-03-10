import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable, of, map } from "rxjs";

export class UpdateTokenInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            map(event => {
                if(event.type !== 4 || event.body.token == undefined || !event.ok)
                    return event

                localStorage.setItem('token', event.body.token)
                delete event.body.token

                return event
            })
        )
    }
}