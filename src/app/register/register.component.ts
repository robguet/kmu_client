import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IProfile_Auth } from '../interfaces/user/user.interface';
import { AuthService } from '../services/auth/auth.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  validateForm!: UntypedFormGroup;
  showLoading = false;
  config = new MatSnackBarConfig();

  constructor(
    private fb: UntypedFormBuilder,
    private _auth: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.config.duration = 3000;
    this.config.verticalPosition = 'bottom';
    this.validateForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      name: ['', [Validators.required]],
      budget: ['', [Validators.required]],
    });
  }

  async signUp(): Promise<any> {
    const { email, password, name, budget } = this.validateForm.value;
    const user: IProfile_Auth = {
      email,
      password,
      name,
      budget,
    };
    this.showLoading = true;
    const data: any = await this._auth.register(user);
    if (data.ok) {
      localStorage.setItem('token', data.token);
      this.router.navigate(['/home']);
      this.showLoading = false;
    } else {
      this.showLoading = false;
      this._snackBar.open(data.message, 'cerrar', this.config);
    }
  }
}
