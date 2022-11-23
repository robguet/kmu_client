import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
  registerSubs!: Subscription;
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

  signUp(): void {
    const { email, password, name, budget } = this.validateForm.value;
    const user: IProfile_Auth = {
      email,
      password,
      name,
      budget,
    };
    this.showLoading = true;
    this.registerSubs = this._auth.register(user).subscribe((data: any) => {
      const { ok, token } = data;
      if (ok) {
        localStorage.setItem('token', token);
        this.router.navigate(['/home']);
        this.showLoading = false;
      } else {
        this.showLoading = false;
        this._snackBar.open(data.message, 'cerrar', this.config);
      }
    });
  }

  ngOnDestroy(): void {
    this.registerSubs?.unsubscribe();
  }
}
