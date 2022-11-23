import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth/auth.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private _auth: AuthService) {}

  canActivate(): Observable<boolean> | boolean {
    return this._auth.isLogged().pipe(
      tap((valid) => {
        if (!valid) {
          this.router.navigateByUrl('');
        }
      }),
    );
  }
}
