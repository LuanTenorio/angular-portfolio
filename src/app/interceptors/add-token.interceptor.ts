import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable, of } from "rxjs";

export class AddTokenInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('token')
        if(token == null)
            return next.handle(req)

        const requestWithToken = req.clone({
            headers: req.headers.set('authorization', `Bearer ${token}`)
        })

        return next.handle(requestWithToken)
    }
}