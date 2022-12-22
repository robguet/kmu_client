import { Component, OnInit } from '@angular/core';
import { ChargesService } from 'src/app/services/charges.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { IDates } from 'src/app/interfaces/charges/charges.model';
import { ICredit_Card } from 'src/app/interfaces/user/user.interface';
import { ICategories, ICharges } from '../../interfaces/charges/charges.model';

export interface IChargesGraph {
  name: string;
  money: number;
  percent?: number;
}
@Component({
  selector: 'app-charges',
  templateUrl: './charges.component.html',
  styleUrls: ['./charges.component.scss'],
})
export class ChargesComponent implements OnInit {
  creditCards: ICredit_Card[] | undefined;
  chargesGraph: IChargesGraph[] = [];
  categories!: ICategories[];
  charges: ICharges[] = [];
  dates!: IDates[] | null;
  totalBalance = 0;
  optionSelected = '0';
  methodPaymentOptionSelected = '0';
  dateRangePicker: any = null;
  enumIcons: any;
  enumColors: any;
  datePickerStyle = {
    zoom: 0.7,
  };

  constructor(private _chargeService: ChargesService, private _authService: AuthService) {}

  async ngOnInit() {
    await this.handleGetCategories();
    this.creditCards = this.paymentMethods;
    this.totalBalance = 0;
    this.dates = this.buildBillingCycleDate();
    await this.getChargesCurrentMonth();
  }

  //? SERVICE FUNCTIONS

  //OBTIENE TODOS LOS CARGOS DEL MES ACTUAL
  async getChargesCurrentMonth(): Promise<void> {
    const { idUser } = this.userInfo;
    const currentBill$ = this._chargeService.getBill(idUser, this.dates);
    this.charges = await currentBill$;
    this.totalBalance = this.calculateTotalBalance(this.charges);
    this.createChargesGraph(this.charges);
  }

  // OBTIENE TODOS LOS CARGOS DEL MES ACTUAL DE LA CATEGORIA SELECCIONADA
  async handleCategoryOnChange(category: number): Promise<void> {
    if (category == 0) {
      this.ngOnInit();
      return;
    }
    this.dateRangePicker = null;
    this.methodPaymentOptionSelected = '0';
    this.totalBalance = 0;

    const { idUser } = this.userInfo;
    this.charges = await this._chargeService.getChargesCategory(idUser, this.dates, category);
    //DE TODOS LOS ARRAYS QUE HACEMOS SEPARADOS POR EL METODO DE PAGO, SE UNE PARA HACER UNO

    this.createChargesGraph(this.charges);
    this.totalBalance = this.calculateTotalBalance(this.charges);
  }

  async handlePaymentMethodOnChange(paymentMethod: number): Promise<void> {
    if (paymentMethod == 0) {
      this.ngOnInit();
      return;
    }
    this.dateRangePicker = null;
    this.optionSelected = '0';
    this.totalBalance = 0;
    const { idUser } = this.userInfo;

    if (!this.dates) {
      return;
    }
    //OBTIENE LA INFORMACION DEL METODO DE PAGO QUE SE HAYA SELECCIONADO DEL paymentMethod EN this.dates
    const billingDate = this.dates.filter((date) => date.idCard === paymentMethod);

    this.charges = await this._chargeService.getChargesytMethod(idUser, billingDate.pop(), paymentMethod);
    this.createChargesGraph(this.charges);
    this.totalBalance = this.calculateTotalBalance(this.charges);
  }

  async handleOnChangeDate(dates: Date[]): Promise<void> {
    this.optionSelected = '0';
    this.methodPaymentOptionSelected = '0';

    if (dates.length < 1) {
      this.ngOnInit();
      return;
    }
    const { idUser, cards } = this.userInfo;
    this.totalBalance = 0;

    const arraynewDates: any = [];
    cards.map(({ cutoffDate, value }) => {
      const start = new Date(dates[0]);
      const end = new Date(dates[1]);
      start.setDate(cutoffDate ? cutoffDate : 1);
      end.setDate(cutoffDate ? cutoffDate : 1);
      if (start.getDate() <= 10) {
        start.setMonth(start.getMonth() + 1);
        end.setMonth(end.getMonth() + 1);
        arraynewDates.push({
          card: value,
          startDate: start,
          endDate: end,
        });
      } else {
        arraynewDates.push({
          card: value,
          startDate: start,
          endDate: end,
        });
      }
    });

    this.charges = await this._chargeService.getBill(idUser, arraynewDates);

    this.createChargesGraph(this.charges);
    this.totalBalance = this.calculateTotalBalance(this.charges);
  }

  async handleGetCategories(): Promise<void> {
    this.categories = await this._chargeService.getCategories();
    this.enumIcons = this.categories.reduce((obj, item) => Object.assign(obj, { [item.label]: item.icon }), {});
    this.enumColors = this.categories.reduce((obj, item) => Object.assign(obj, { [item.label]: item.color }), {});
  }

  async handleDeleteCharge(charge: ICharges) {
    console.log(charge);
    // await this._chargeService.deleteCharge(charge);
  }

  //?HELPERS FUNCTIONS
  calculateTotalBalance(data: ICharges[] | IChargesGraph[]): number {
    let totalMoney = 0;
    data.map((data: ICharges | IChargesGraph) => {
      totalMoney = totalMoney + data.money;
    });

    return totalMoney;
  }

  buildBillingCycleDate(): IDates[] | null {
    const { cards } = this.userInfo;
    if (cards.length == 0) {
      return null;
    }

    const arrayDates: IDates[] = [];

    cards.map(({ cutoffDate, fk_idCard, value }) => {
      const today = new Date();
      let startMonth = today.getMonth();
      const startYear = today.getFullYear();
      let endMonth = today.getMonth() + 1;
      let endYear = today.getFullYear();
      //Compare if today is bigger than cutdate billing cycle
      if (cutoffDate && today.getDate() > cutoffDate) {
        startMonth = today.getMonth() + 1 === 13 ? 1 : today.getMonth() + 1;
        endMonth = today.getMonth() + 2 === 13 ? 1 : today.getMonth() + 2;
      }
      if (startMonth === 12 && endMonth == 1) {
        endYear = today.getFullYear() + 1;
      }

      const startDate = `${startYear}-${startMonth}-${cutoffDate && cutoffDate + 1}`;
      const endDate = `${endYear}-${endMonth}-${cutoffDate && cutoffDate}`;

      const dates = {
        idCard: fk_idCard,
        card: value,
        startDate,
        endDate,
      };
      arrayDates.push(dates);
    });
    return arrayDates;
  }

  createChargesGraph(charges: ICharges[]): void {
    const cards: IChargesGraph[] = [];
    const result = charges.reduce((previousValue: any, actualValue: any) => {
      if (actualValue.value !== null) {
        const name = actualValue.label;
        const money = actualValue.money;
        return (previousValue[name] = (previousValue[name] || 0) + money), previousValue;
      } else {
        return previousValue;
      }
    }, Object.create(null));

    Object.entries(result).forEach(([key, value]: any) => {
      cards.push({ name: key, money: value });
    });

    const total = this.calculateTotalBalance(cards);
    this.chargesGraph = cards.map((item) => {
      const percent = (item.money * 100) / total;
      return {
        ...item,
        percent: Math.ceil(percent),
      };
    });
  }

  //?GETTERS
  get userInfo() {
    const {
      usuario: { idUser, budget, cards, investmentLimit },
    } = this._authService;
    return { idUser, budget, cards, investmentLimit };
  }
  get paymentMethods(): ICredit_Card[] | undefined {
    return this._authService.usuario.cards;
  }
}
