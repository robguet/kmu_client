export interface IUser_Response {
  name?: string;
  email?: string;
  cutDate: number;
  budget?: number;
  cards?: ICredit_Card[];
  idUser: number;
  investmentLimit: number;
}

export interface IUser_Profile {
  idUser: number;
  name: string;
  email: string;
  cutDate?: number;
  budget: number;
  cards: ICredit_Card[];
  investmentLimit: number;
}

export interface IAuthenticated_Response {
  ok: boolean;
  token: string;
  user: IUser_Profile;
}

export interface ICredit_Card {
  label?: string;
  value: string;
  fk_idCard?: number;
  cutoffDate?: number;
  pendingBalance?: number;
  idCard?: number;
}

export interface IProfile_Auth {
  email: string;
  password: string;
  cutDate?: number;
  budget?: number;
  name?: string;
}

export interface ILogin {
  ok: boolean;
  token: string;
}
