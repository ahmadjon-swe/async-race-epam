import type { Car, Paginated } from '../types';
import { CARS_PER_PAGE } from '../utils/constants';
import { request, requestPaginated } from './http';

export function getCars(page: number): Promise<Paginated<Car>> {
  return requestPaginated<Car>('/garage', { _page: page, _limit: CARS_PER_PAGE });
}

export function getCar(id: number): Promise<Car> {
  return request<Car>(`/garage/${id}`);
}

export function createCar(name: string, color: string): Promise<Car> {
  return request<Car>('/garage', { method: 'POST', body: { name, color } });
}

export function updateCar(id: number, name: string, color: string): Promise<Car> {
  return request<Car>(`/garage/${id}`, { method: 'PUT', body: { name, color } });
}

export function deleteCar(id: number): Promise<void> {
  return request<void>(`/garage/${id}`, { method: 'DELETE' });
}
