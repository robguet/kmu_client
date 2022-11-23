import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent {
  constructor(private router: Router) {}

  navigate(e: number) {
    const routes: any = {
      1: '/home',
      2: '/new',
      3: '/history',
      4: '/charges',
      5: '/profile',
    };

    const selectedRoute = routes[e];

    this.router.navigateByUrl(selectedRoute);
  }
}
