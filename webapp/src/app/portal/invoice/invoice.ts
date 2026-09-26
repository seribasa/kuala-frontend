import {Component, OnInit} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {PageHeader} from '../../shared/page-header';
import {FormsModule} from '@angular/forms';
import {InvoiceService} from './invoice.service';

@Component({
  selector: 'app-invoice',
  imports: [FormsModule, MatButton, PageHeader],
  templateUrl: './invoice.html',
})
export class Invoice implements OnInit {

  invoices: any[] = [];
  pageSize = 10;
  searchKey = '';
  isLoading = false;
  hasMoreInvoices = true;
  errorMessage = '';

  constructor(private readonly invoiceService: InvoiceService) {
  }

  async ngOnInit(): Promise<void> {
    await this.loadInvoices();
  }

  async loadInvoices(): Promise<void> {
    if (this.isLoading || !this.hasMoreInvoices) return;

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const response = await this.invoiceService.listInvoices({
        offset: this.invoices.length,
        limit: this.pageSize,
      });

      const loadedInvoices = response.invoices;
      this.invoices = [...this.invoices, ...loadedInvoices];
      this.hasMoreInvoices = this.hasAdditionalInvoices(response.total, response.invoices.length);
    } catch (err) {
      console.error('Failed to load invoices', err);
      this.errorMessage = 'We could not load invoices. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  get filteredInvoices(): any[] {
    const query = this.searchKey.trim().toLowerCase();
    if (!query) return this.invoices;

    return this.invoices.filter((invoice) => [
      invoice.invoiceNumber,
      invoice.description,
      invoice.amount,
      invoice.invoiceDate,
      invoice.dueDate,
      invoice.status,
    ].some((value) => value.toLowerCase().includes(query)));
  }

  viewInvoice(invoice: any): void {
    console.log('View invoice', invoice.id);
  }

  savePdf(invoice: any): void {
    console.log('Save invoice PDF', invoice.id);
  }

  async payInvoice(invoice: any): Promise<void> {
    try {
      this.errorMessage = '';
      const redirectUrl = await this.invoiceService.payInvoice(invoice.invoiceId);
      if (redirectUrl) {
        this.redirectTo(redirectUrl);
      } else {
        this.errorMessage = 'We could not initiate payment. Please try again.';
      }
    } catch (err) {
      console.error('Failed to pay invoice', err);
      this.errorMessage = 'We could not initiate payment. Please try again.';
    }
  }

  redirectTo(url: string): void {
    // window.location.href = url;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  private hasAdditionalInvoices(total: number | undefined, invoiceCount: number): boolean {
    if (typeof total === 'number') {
      return this.invoices.length < total;
    }

    return invoiceCount === this.pageSize;
  }

}
