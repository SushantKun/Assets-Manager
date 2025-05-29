import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './core/components/nav/nav.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        NavComponent
    ],
    template: `
        <app-nav></app-nav>
        <router-outlet></router-outlet>
    `,
    styles: [`
        :host {
            display: block;
            min-height: 100vh;
        }
    `]
})
export class AppComponent {}
