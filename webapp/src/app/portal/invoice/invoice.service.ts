import {Injectable} from '@angular/core';
import {ApiService} from '../../api/ApiService';

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitAmount: number;
  amount: number;
}

export interface InvoiceApiItem {
  id: string;
  number: string;
  userId: string;
  subscriptionId: string;
  status: string;
  currency: string;
  amount: number;
  balance: number;
  items: InvoiceLineItem[];
  createdAt: string;
  dueDate: string;
}

interface InvoicesApiResponse {
  invoices?: InvoiceApiItem[];
  total?: number;
  totalCount?: number;
  count?: number;
}

export interface InvoiceListParams {
  offset: number;
  limit: number;
  searchKey?: string;
}

export interface InvoiceListResponse {
  invoices: InvoiceApiItem[];
  total?: number;
}

@Injectable({providedIn: 'root'})
export class InvoiceService {

  constructor(private readonly apiService: ApiService) {
  }

  async listInvoices(params: InvoiceListParams): Promise<InvoiceListResponse> {
    const response = await this.apiService.get<InvoicesApiResponse>('/invoices', {
      params: {
        offset: params.offset,
        limit: params.limit,
        searchKey: params.searchKey || undefined,
      },
    });

    return {
      invoices: response.invoices ?? [],
      total: response.total ?? response.totalCount ?? response.count,
    };
  }
}
