import type { Winner, Paginated, WinnerSortField, SortOrder } from '../types';
import { WINNERS_PER_PAGE } from '../utils/constants';
import { request, requestPaginated } from './http';

export function getWinners(
  page: number,
  sort: WinnerSortField,
  order: SortOrder,
): Promise<Paginated<Winner>> {
  return requestPaginated<Winner>('/winners', {
    _page: page,
    _limit: WINNERS_PER_PAGE,
    _sort: sort,
    _order: order,
  });
}

export function getWinner(id: number): Promise<Winner> {
  return request<Winner>(`/winners/${id}`);
}

export function createWinner(id: number, wins: number, time: number): Promise<Winner> {
  return request<Winner>('/winners', { method: 'POST', body: { id, wins, time } });
}

export function updateWinner(id: number, wins: number, time: number): Promise<Winner> {
  return request<Winner>(`/winners/${id}`, { method: 'PUT', body: { wins, time } });
}

export function deleteWinner(id: number): Promise<void> {
  return request<void>(`/winners/${id}`, { method: 'DELETE' });
}
