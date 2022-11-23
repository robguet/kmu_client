import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { cardsList } from 'src/app/interfaces/const';
import { IUser_Profile } from 'src/app/interfaces/user/user.interface';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user!: IUser_Profile;
  listOfOption = cardsList;
  bankForm: any;
  //LOADINGS
  loadingSaveProfile = false;

  constructor(private _fb: UntypedFormBuilder, private _auth: AuthService, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.bankForm = this._fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      cutDate: [''],
      budget: [''],
      cards: [],
      investmentLimit: [''],
    });
    this.getUser();
  }

  async onSubmit(): Promise<void> {
    this.loadingSaveProfile = true;
    const profile: IUser_Profile = {
      ...this.bankForm.value,
      idUser: this.user.idUser,
    };
    const cardsInfo: number[][] = this.user?.cards.map((control) => {
      return [this.bankForm.get(control.value).value, this.user.idUser, control.fk_idCard];
    });

    await lastValueFrom(await this._auth.updateCutoffDate(cardsInfo));

    const res = await lastValueFrom(await this._auth.updateProfile(profile));
    const config = new MatSnackBarConfig();
    config.duration = 2000;
    config.verticalPosition = 'bottom';
    this._snackBar.open('Guardado con éxito', 'cerrar', config);
    this.loadingSaveProfile = false;
  }

  //?HELPERS
  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.value === o2.value : o1 === o2);

  populateFields(): void {
    this.bankForm.patchValue(this.user);
    // this.bankForm.patchValue({ cards: this.user?.cards });
  }

  //?GETTERS
  async getUser(): Promise<void> {
    this.user = this._auth.usuario;
    this.user?.cards.forEach((control) =>
      this.bankForm.addControl(
        control.value,
        this._fb.control(control.cutoffDate ? control.cutoffDate : '', [Validators.required]),
      ),
    );
    this.populateFields();
  }
}
