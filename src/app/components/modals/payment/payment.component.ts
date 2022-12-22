import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICardBalanceInfo, IPayment } from 'src/app/interfaces/charges/charges.model';
import { ChargesService } from 'src/app/services/charges.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent {
  amount!: number;
  status = false;
  payment!: IPayment;
  pendingBalance = this.data.pendingBalance;
  isDisabled = true;

  constructor(
    private _chargesService: ChargesService,
    public dialogRef: MatDialogRef<PaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ICardBalanceInfo,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleChangeInput() {
    if (this.amount == null) {
      this.pendingBalance = this.data.pendingBalance;
      this.isDisabled = true;
      return;
    }
    this.isDisabled = false;
    this.pendingBalance = this.data.pendingBalance - this.amount;
    if (this.pendingBalance < 0) {
      this.isDisabled = true;
      return;
    }
  }

  //SERVICES
  handleMakePayment(): void {
    const newBalance = this.data.pendingBalance - this.amount;
    this.payment = {
      idCard: this.data.idCard,
      amount: newBalance,
    };

    this._chargesService.makePayment(this.payment).subscribe((data) => {
      // if (data.ok) {
      this.status = true;
      setTimeout(() => {
        this.dialogRef.close(this.payment);
      }, 1000);
      // }
    });
  }
}
