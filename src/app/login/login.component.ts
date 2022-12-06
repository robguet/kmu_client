import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IProfile_Auth } from '../interfaces/user/user.interface';
import { AuthService } from '../services/auth/auth.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  showLoading = false;
  form!: UntypedFormGroup;
  checked = false;
  buttonDisabled = true;

  constructor(
    private _fb: UntypedFormBuilder,
    private _auth: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    const user = this.handleGetLocalUser();
    this.handleInitForm(user);
  }

  //HELPERS
  handleInitForm(user: IProfile_Auth) {
    this.form = this._fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      remember: [''],
    });

    if (user) {
      this.checked = true;
      const { email, password } = user;
      this.form.patchValue({
        email,
        password,
      });
    }
  }

  handleCheckValue(isChecked: boolean): boolean {
    if (!isChecked) {
      localStorage.removeItem('user');
    }
    this.checked = isChecked;
    return isChecked;
  }

  handleGetLocalUser(): IProfile_Auth {
    const user: IProfile_Auth = JSON.parse(localStorage.getItem('user')!);
    return user || null;
  }

  //?SERVICE CALLS

  async handleLogin(): Promise<void> {
    if (this.form.valid) {
      this.showLoading = true;
      try {
        const user: IProfile_Auth = {
          email: this.form.value.email,
          password: this.form.value.password,
        };
        if (this.checked == true) {
          localStorage.setItem('user', JSON.stringify(user));
        }
        const { ok, token } = await this._auth.login(user);
        if (ok) {
          localStorage.setItem('token', token);
          this.router.navigate(['/home']);
        }
      } catch (error: any) {
        this.showLoading = false;
        const config = new MatSnackBarConfig();
        config.duration = 2000;
        config.verticalPosition = 'bottom';
        this._snackBar.open(error.error.message, 'cerrar', config);
        this.showLoading = false;
      }
    }
  }
}
