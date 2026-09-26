import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {PageHeader} from '../../../shared/page-header';

@Component({
  selector: 'app-payment-failed',
  imports: [PageHeader, MatButton, RouterLink],
  templateUrl: './payment-failed.html',
})
export class PaymentFailed {}
