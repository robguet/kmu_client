import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { NewChargeComponent } from './components/new-charge/new-charge.component';
import { HistoryComponent } from './components/history/history.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ChargesComponent } from './components/charges/charges.component';
import { HeaderComponent } from './components/header/header.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { HttpClientModule } from '@angular/common/http';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { LoginComponent } from './login/login.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { RegisterComponent } from './register/register.component';
import { MatChipsModule } from '@angular/material/chips';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MonthlyChargesComponent } from './components/monthly-charges/monthly-charges.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { PaymentComponent } from './components/modals/payment/payment.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TabsComponent,
    NewChargeComponent,
    HistoryComponent,
    ProfileComponent,
    ChargesComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    MonthlyChargesComponent,
    PaymentComponent,
  ],
  imports: [
    BrowserModule,
    NzProgressModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSlideToggleModule,
    NzBadgeModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSnackBarModule,
    NzCheckboxModule,
    MatExpansionModule,
    MatDividerModule,
    MatListModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    // ServiceWorkerModule.register('ngsw-worker.js', {
    //   enabled: false,
    //   // Register the ServiceWorker as soon as the app is stable
    //   // or after 30 seconds (whichever comes first).
    //   registrationStrategy: 'registerWhenStable:30000',
    // }),
    HttpClientModule,
    NzButtonModule,
    NzDatePickerModule,
    NzSelectModule,
    NzInputModule,
    NzFormModule,
    MatChipsModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent],
})
export class AppModule {}
