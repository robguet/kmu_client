import { Component, OnInit } from '@angular/core';
import { NzProgressStatusType } from 'ng-zorro-antd/progress';
import { firstValueFrom } from 'rxjs';
import { IBalanceByCard, IDates, ICategories, ICharges } from 'src/app/interfaces/charges/charges.model';
import { ICredit_Card } from 'src/app/interfaces/user/user.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ChargesService } from 'src/app/services/charges.service';
import { MatDialog } from '@angular/material/dialog';
import { PaymentComponent } from '../modals/payment/payment.component';

export interface progressBar {
  percent: number;
  status: NzProgressStatusType;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  creditCardsBalance: ICredit_Card[] = [];
  balanceByCard: IBalanceByCard[] = [];
  chargesCurrentBill: ICharges[] = [];
  categoriesList!: ICategories[];
  dates!: IDates[] | null;
  totalInvested = 0;
  userBudget = 0;
  totalBalance = 0;
  totalCreditCards = 0;
  totalInvestment = 0;
  cardsLength = 0;
  globalProgress: progressBar = {
    percent: 0,
    status: 'normal',
  };
  investmentProgress: progressBar = {
    percent: 0,
    status: 'normal',
  };

  constructor(private _chargeService: ChargesService, private _authService: AuthService, public _dialog: MatDialog) {}

  async ngOnInit() {
    const { budget, cards } = this.userInfo;
    this.userBudget = budget || 0;
    this.cardsLength = cards?.length || 0;
    this.dates = this.handleBuildBillingCycleDate();
    this.creditCardsBalance = cards;
    this.chargesCurrentBill = await this.handleGetChargesCurrentBill();
    // SE TRAE LOS CARGOS POR LA CATEGORIA DE 'investment'
    await this.handleGetChargesByCategory(1);
    this.handleGetChargesByCards();
    this.handleGetCurrentBill();
    await this.handleGetCategoriesList();
  }

  //?SERVICE FUNCTIONS
  //OBTIENE LOS CARGOS POR CATEGORIA
  async handleGetChargesByCategory(category: number): Promise<void> {
    const { idUser, investmentLimit } = this.userInfo;

    const chargesByCategory = await firstValueFrom(
      await this._chargeService.getChargesCategory(idUser, this.dates, category),
    );

    this.totalInvestment = this.calculateTotalMoney(chargesByCategory);
    this.investmentProgress = this.calculateProgressBar(this.totalInvestment, investmentLimit) as progressBar;
  }

  //OBTIENE LA LISTA DE CATEGORIA DE LA DB
  async handleGetCategoriesList(): Promise<void> {
    this.categoriesList = await firstValueFrom(await this._chargeService.getCategories());
  }

  async handleGetChargesCurrentBill(): Promise<ICharges[]> {
    const { idUser } = this.userInfo;
    return firstValueFrom(await this._chargeService.getBill(idUser, this.dates));
  }

  //?HELPERS FUNCTIONS
  handleGetCurrentBill(): void {
    //SOLO MOSTRAMOS EL BALANCE DE TARJETAS, DESCARTAMOS EFECTIVO
    this.creditCardsBalance = this.creditCardsBalance.filter((card) => card.label !== 'Efectivo');

    //SUMAMOS EL BALANCE DE LAS TARJETAS
    this.creditCardsBalance.map((card) => {
      if (card.pendingBalance) {
        this.totalBalance = this.totalBalance + card.pendingBalance;
      }
    });

    //OBTENEMOS LO GASTADO EN EFECTIVO Y LO SUMAMOS A this.totalBalance PARA MOSTRARLO
    const cash = this.balanceByCard.filter((method) => method.card === 'Efectivo');
    const [method] = cash;

    let { money } = method;
    if (!money) {
      money = 0;
    }
    this.totalCreditCards = this.totalBalance;
    this.totalBalance += money;
    //=========================================================
    this.globalProgress = this.calculateProgressBar(this.totalBalance, this.userBudget);
  }

  handleGetChargesByCards(): void {
    const result = this.chargesCurrentBill.reduce((previousValue: any, actualValue: any) => {
      if (actualValue.method !== null) {
        const name = actualValue.method;
        const money = actualValue.money;

        return (previousValue[name] = (previousValue[name] || 0) + money), previousValue;
      } else {
        return previousValue;
      }
    }, Object.create(null));

    Object.entries(result).forEach(([key, method]: any) => {
      this.balanceByCard.push({ card: key, money: method });
    });
  }

  handleOpenModal(info: ICredit_Card): void {
    const dialogRef = this._dialog.open(PaymentComponent, {
      width: '100%',
      data: info,
    });

    dialogRef.afterClosed().subscribe((result) => {
      const newBalance = this.creditCardsBalance.map((card) => {
        if (card.idCard == result.idCard) {
          return {
            ...card,
            pendingBalance: result.amount,
          };
        }
        return {
          ...card,
        };
      });

      this.creditCardsBalance = newBalance;
    });
  }

  handleBuildBillingCycleDate(): IDates[] | null {
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
      //Compare if today is bigger than cutoffDate billing cycle
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

  //CALCULA EL TOTAL GASTADO DE UNA CATEGORIA
  calculateTotalMoney(data: ICharges[]): number {
    let total = 0;
    data.map((data: ICharges) => {
      total = total + data.money;
    });
    return total;
  }

  calculateProgressBar(total: number, budget: number): progressBar {
    const percent = Math.round((total * 100) / budget);

    if (percent < 100) {
      return {
        percent,
        status: 'normal',
      };
    } else if (percent > 100) {
      return {
        percent,
        status: 'exception',
      };
    } else {
      return {
        percent,
        status: 'success',
      };
    }
  }

  //?GETTERS
  get userInfo() {
    const {
      usuario: { idUser, cutDate, budget, cards, investmentLimit },
    } = this._authService;
    return { idUser, cutDate, budget, cards, investmentLimit };
  }
}
