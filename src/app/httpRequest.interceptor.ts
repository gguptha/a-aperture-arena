import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

/**
 * Intercept
 */
export const httpRequestInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> =>
{
    const _router = inject(Router);

    // Clone the request object
    let newReq = req.clone();

    // Request
    //
    // If the access token didn't expire, add the Authorization header.
    // We won't add the Authorization header if the access token expired.
    // This will force the server to return a "401 Unauthorized" response
    // for the protected API routes which our response interceptor will
    // catch and delete the access token from the local storage while logging
    // the user out from the app.
    
    newReq = req.clone({
        headers: req.headers.set('Authorization', 'Basic ' + btoa('gopinath.br@gmail.com' + ':' + 'gops05'))
    });
    
    // Response
    return next(newReq).pipe(
        catchError((error) =>
        {
            console.log('catching error');
            
            // Catch "401 Unauthorized" responses
            if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 0)) {
                // Sign out
                // authService.signOut();
                // Redirect to login page
                _router.navigate(['sign-in']);
            }
            else if (error instanceof HttpErrorResponse && error.status === 404) {
                console.log('not found, handle it');
            }

            return throwError(error);
        }),
    );
};
