import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of, Observable, firstValueFrom } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  IAuthenticated_Response,
  ILogin,
  IProfile_Auth,
  IUser_Profile,
  IUser_Response,
} from 'src/app/interfaces/user/user.interface';
import { Endpoints } from 'src/app/interfaces/endpoints/endpoints';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  private _usuario!: IUser_Profile;

  //?SERVICE CALL
  isLogged(): Observable<boolean> {
    const headers = new HttpHeaders().set('x-token', localStorage.getItem('token') || 'noToken');

    return this.http.get<any>(`${environment.baseUrl}${Endpoints.NEW_TOKEN}`, { headers }).pipe(
      map((resp: IAuthenticated_Response) => {
        localStorage.setItem('token', resp.token!);
        const { user } = resp;
        this._usuario = { ...user };

        return resp.ok;
      }),
      catchError((err) => of(err, false)),
    );
  }

  register(user: IProfile_Auth): Promise<IUser_Response> {
    return firstValueFrom(this.http.post<IUser_Response>(`${environment.baseUrl}${Endpoints.SIGN_UP}`, user));
  }

  async login(user: IProfile_Auth): Promise<ILogin> {
    return firstValueFrom(this.http.post<ILogin>(`${environment.baseUrl}${Endpoints.SIGN_IN}`, user));
  }

  async updateProfile(profile: IUser_Profile): Promise<any> {
    return firstValueFrom(
      this.http.post(`${environment.baseUrl}${Endpoints.UPDATE_PROFILE}/${profile.idUser}`, profile),
    );
  }

  async updateCutoffDate(array: number[][]): Promise<any> {
    return firstValueFrom(this.http.post(`${environment.baseUrl}${Endpoints.UPDATE_CUTOFF}`, array));
  }

  //?GETTERS & SETTERS
  get usuario(): IUser_Profile {
    return { ...this._usuario };
  }

  set setUsuario(user: IUser_Profile) {
    this._usuario = user;
  }
}
