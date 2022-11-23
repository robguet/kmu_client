export interface IGeneral_Response {
  ok: boolean;
  result: ICharges[];
}

export interface ICategories_Response {
  ok: boolean;
  result: ICategories_List[];
}

export interface ICard_Charge_Response {
  ok: boolean;
  result: ICharge_Cards_List[];
}

export interface INew_Charge_Response {
  ok: boolean;
  formatDate?: string;
}

export interface ICategories_List {
  color: string;
  icon: string;
  idCategory: number;
  label: string;
  size: string;
}

export interface ICharge_Cards_List {
  label: string;
  money: number;
  value: string;
}

export interface IBalanceByCard {
  card: string;
  money: number;
}

export interface INew_Charge {
  FK_idCategory?: string;
  date: any;
  money?: number;
  place?: [];
  idCard?: string;
  title?: string;
  start?: string;
  end?: string;
  idUser?: number;
}

export interface IPayment {
  idCard: number;
  amount: number;
}

export interface ICardBalanceInfo {
  cutoffDate: number;
  idCard: number;
  fk_idCard: number;
  label: string;
  pendingBalance: number;
  value: string;
}

export interface IDates {
  card: string;
  endDate: string;
  idCard: number | undefined;
  startDate: string;
}

export interface ICharges {
  color: string;
  date: string;
  icon: string;
  label: string;
  method: string;
  money: number;
  title: string;
  value: string;
}

export interface ICategories {
  color: string;
  icon: string;
  idCategory: number;
  label: string;
  size: null;
}
