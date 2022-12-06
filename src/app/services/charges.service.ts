import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import {
  ICategories_List,
  INew_Charge,
  INew_Charge_Response,
  IPayment,
  ICategories,
  ICharges,
} from '../interfaces/charges/charges.model';
import { Endpoints } from '../interfaces/endpoints/endpoints';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChargesService {
  newChargeCreated = new BehaviorSubject<boolean>(false);
  _categories!: ICategories_List[];
  _charges!: ICharges[];
  constructor(private http: HttpClient) {}

  //?SERVICE CALL
  makePayment(payment: IPayment): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}charges/make/payment`, payment);
  }

  //PROMISES
  async getCategories(): Promise<ICategories[]> {
    return firstValueFrom(this.http.get<ICategories[]>(`${environment.baseUrl}${Endpoints.GET_CATEGORIES}`));
  }

  async getBill(idUser: number | undefined, dates: any): Promise<ICharges[]> {
    return firstValueFrom(this.http.post<ICharges[]>(`${environment.baseUrl}charges/${idUser}/get`, dates));
  }

  async getChargesCategory(idUser: number | undefined, dates: any, FK_idCategory: number): Promise<ICharges[]> {
    return firstValueFrom(
      this.http.post<ICharges[]>(`${environment.baseUrl}charges/${idUser}/get/${FK_idCategory}`, dates),
    );
  }

  async getChargesytMethod(idUser: number | undefined, dates: any, fk_idCard: number): Promise<ICharges[]> {
    return firstValueFrom(
      this.http.post<ICharges[]>(`${environment.baseUrl}charges/${idUser}/get/byPaymentMethod/${fk_idCard}`, dates),
    );
  }

  async createCharge(charge: INew_Charge, isMonthly: boolean): Promise<INew_Charge_Response> {
    return firstValueFrom(this.http.post<INew_Charge_Response>(`${environment.baseUrl}${Endpoints.NEW_CHARGE}`, {
      ...charge,
      isMonthly,
    }));
  }

  //?GETTERS & SETTERS
  get charges() {
    return this._charges;
  }
  get categoryList() {
    return { ...this._categories };
  }

  set setCharges(charges: ICharges[]) {
    this._charges = charges;
  }
  set setCategories(categories: ICategories_List[]) {
    this._categories = categories;
  }
}
