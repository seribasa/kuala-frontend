import {Component, OnInit} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {PageHeader} from '../../shared/page-header';
import {FormsModule} from '@angular/forms';
import {InvoiceApiItem, InvoiceService} from './invoice.service';

interface InvoiceItem {
  id: string;
  number: string;
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
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;
  searchKey = '';
  isLoading = false;
  errorMessage = '';

  constructor(private readonly invoiceService: InvoiceService) {
  }

  async ngOnInit(): Promise<void> {
    await this.loadInvoices();
  }

  async loadInvoices(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      const response = await this.invoiceService.listInvoices({
        offset: (this.currentPage - 1) * this.pageSize,
        limit: this.pageSize,
        searchKey: this.searchKey.trim(),
      });

      this.invoices = response.invoices.map((invoice) => this.mapInvoice(invoice));
      this.totalPages = this.getTotalPages(response.total, response.invoices.length);
    } catch (err) {
      console.error('Failed to load invoices', err);
      this.invoices = [];
      this.totalPages = 1;
      this.errorMessage = 'We could not load invoices. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  async searchInvoices(): Promise<void> {
    this.currentPage = 1;
    await this.loadInvoices();
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

  async previousPage(): Promise<void> {
    if (this.currentPage <= 1 || this.isLoading) return;
    this.currentPage--;
    await this.loadInvoices();
  }

  async nextPage(): Promise<void> {
    if (this.currentPage >= this.totalPages || this.isLoading) return;
    this.currentPage++;
    await this.loadInvoices();
  }

  private getTotalPages(total: number | undefined, invoiceCount: number): number {
    if (typeof total === 'number') {
      return Math.max(1, Math.ceil(total / this.pageSize));
    }

    return invoiceCount === this.pageSize ? this.currentPage + 1 : this.currentPage;
  }

  private mapInvoice(invoice: InvoiceApiItem): InvoiceItem {
    return {
      id: invoice.id,
      number: invoice.number || invoice.id,
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
