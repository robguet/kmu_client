import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { ChargesService } from 'src/app/services/charges.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ICategories, INew_Charge } from 'src/app/interfaces/charges/charges.model';
import { ICredit_Card, IUser_Profile } from 'src/app/interfaces/user/user.interface';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-charge',
  templateUrl: './new-charge.component.html',
  styleUrls: ['./new-charge.component.scss'],
})
export class NewChargeComponent implements OnInit {
  ChargeCreatedLabelSubscription: Subscription = new Subscription();
  creditCards: ICredit_Card[] | undefined;
  categoriesList!: ICategories[];
  newCharge: INew_Charge | undefined;
  showLoading = false;
  isMonthly = false;
  status!: boolean;
  form!: UntypedFormGroup;
  isMonthlyPayment = 0;
  config = new MatSnackBarConfig();

  constructor(
    private _fb: UntypedFormBuilder,
    private _chargeService: ChargesService,
    private _auth: AuthService,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.config.duration = 3000;
    this.config.verticalPosition = 'bottom';
    this.initForm();
    this.creditCards = this.cards;
    this._chargeService.newChargeCreated.next(false);
    this.ChargeCreatedLabelSubscription = this._chargeService.newChargeCreated.subscribe((status) => {
      this.status = status;
    });
    this.getCategories();
  }

  //?SERVICE FUNCTIONS
  async handleOnCreateCharge(): Promise<void> {
    if (!this.form.valid) return;
    const { idUser } = this.userInfo;
    this.showLoading = true;
    const {
      value: { title, money, idCard, FK_idCategory, date, start, end },
    } = this.form;

    this.newCharge = {
      title,
      idUser,
      money,
      idCard,
      FK_idCategory,
      date,
    };

    //STARTS MONTHLY PAYMENTS
    if (this.isMonthlyPayment == 1) {
      console.log(this.isMonthlyPayment);
      this.handleCreateMonthlyCharges(start, end);
    }

    //STARTS ONETIME PAYMENT
    const charge = {
      ...this.newCharge,
      idUser,
      date: new Date(this.newCharge?.date), //.toDateString()
    };
    const { ok } = await this._chargeService.createCharge(charge, this.isMonthly);
    this._chargeService.newChargeCreated.next(ok);
    this.showLoading = false;
    this._snackBar.open('Cargo creado!', 'cerrar', this.config);
    // this.initForm();
  }

  async handleCreateMonthlyCharges(start: Date, end: Date): Promise<void> {
    const monthlyCharge = {
      ...this.newCharge,
      date: new Date(this.newCharge?.date), //.toDateString(),
    };
    const chargesToCreate = this.createMonthlyCharges(start, end, monthlyCharge);
    chargesToCreate.map(async (charge, chargesLength) => {
      if (chargesLength >= 1) {
        this.isMonthly = true;
      }
      await this._chargeService.createCharge(charge, this.isMonthly);

      this._chargeService.newChargeCreated.next(true);
      this.showLoading = false;
      this._snackBar.open('Cargo creado!', 'cerrar', this.config);
    });
    this.isMonthly = false;
    return;
  }

  async getCategories(): Promise<void> {
    this.categoriesList = await this._chargeService.getCategories();
    return;
  }

  //?HELPERS
  onTabChange(event: MatTabChangeEvent): number {
    return (this.isMonthlyPayment = event.index); // 0 = ONE TIME PAYMENT; 1 = MONTHLY PAYMENT
  }

  initForm(): void {
    this.form = this._fb.group({
      title: ['', [Validators.required, Validators.maxLength(18)]],
      money: ['', Validators.required],
      idCard: ['', Validators.required],
      FK_idCategory: ['', Validators.required],
      date: [new Date(), Validators.required],
      start: [new Date()],
      end: [new Date()],
    });
  }

  //RECIBE UN ARREGLO DEL CARGO Y CREA UN ARRAY DE ESE CARGO A MESES SIN INTERESES
  createMonthlyCharges(start: Date, end: Date, newCharge: INew_Charge): INew_Charge[] {
    let months;
    months = (end.getFullYear() - start.getFullYear()) * 12;
    months -= start.getMonth();
    months += end.getMonth();

    const charges = [];

    for (let i = 0; i <= months; i++) {
      charges.push(newCharge);
    }
    let flag = false;
    let add = 0;
    return charges.map((charge: INew_Charge) => {
      if (flag) {
        add = +1;
      }
      flag = true;
      return {
        ...charge,
        date: new Date(start.setMonth(start.getMonth() + add)),
      };
    });
  }

  //?GETTERS
  get userInfo(): IUser_Profile {
    const {
      usuario: { idUser, cutDate, budget, cards, investmentLimit, email, name },
    } = this._auth;
    return { idUser, cutDate, budget, cards, investmentLimit, email, name };
  }

  get cards(): ICredit_Card[] | undefined {
    return this._auth.usuario.cards;
  }

  //?UNSUBSCRIBE SUBSCRIPTIONS
  ngOnDestroy(): void {
    this.ChargeCreatedLabelSubscription.unsubscribe();
  }
}
