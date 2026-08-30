import {Component, OnInit} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {PageHeader} from '../../shared/page-header';
import {FormsModule} from '@angular/forms';
import {InvoiceApiItem, InvoiceService} from './invoice.service';

interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  description: string;
  amount: string;
  invoiceDate: string;
  dueDate: string;
  status: string;
  canPay: boolean;
  raw: InvoiceApiItem;
}

@Component({
  selector: 'app-invoice',
  imports: [FormsModule, MatButton, PageHeader],
  templateUrl: './invoice.html',
})
export class Invoice implements OnInit {

  invoices: InvoiceItem[] = [];
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

      const loadedInvoices = response.invoices.map((invoice) => this.mapInvoice(invoice));
      this.invoices = [...this.invoices, ...loadedInvoices];
      this.hasMoreInvoices = this.hasAdditionalInvoices(response.total, response.invoices.length);
    } catch (err) {
      console.error('Failed to load invoices', err);
      this.errorMessage = 'We could not load invoices. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  get filteredInvoices(): InvoiceItem[] {
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

  viewInvoice(invoice: InvoiceItem): void {
    console.log('View invoice', invoice.id);
  }

  savePdf(invoice: InvoiceItem): void {
    console.log('Save invoice PDF', invoice.id);
  }

  payInvoice(invoice: InvoiceItem): void {
    console.log('Pay invoice', invoice.id);
  }

  private hasAdditionalInvoices(total: number | undefined, invoiceCount: number): boolean {
    if (typeof total === 'number') {
      return this.invoices.length < total;
    }

    return invoiceCount === this.pageSize;
  }

  private mapInvoice(invoice: InvoiceApiItem): InvoiceItem {
    return {
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      description: invoice.items?.map((item) => item.description).filter(Boolean).join(', ') || '-',
      amount: this.formatCurrency(invoice.amount, invoice.currency),
      invoiceDate: this.formatDate(invoice.createdAt),
      dueDate: this.formatDate(invoice.dueDate),
      status: this.formatStatus(invoice.status),
      canPay: invoice.balance > 0,
      raw: invoice,
    };
  }

  private formatCurrency(amount: number, currency: string): string {
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currency || 'USD',
      }).format(amount);
    } catch {
      return `${currency} ${amount}`.trim();
    }
  }

  private formatDate(value: string): string {
    if (!value) return '-';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';

    return new Intl.DateTimeFormat(undefined, {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }

  private formatStatus(status: string): string {
    return status
      .split(/[-_\s]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}
