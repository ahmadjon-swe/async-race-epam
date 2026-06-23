import type { EngineResponse, DriveResponse } from '../types';
import { request } from './http';

export function startEngine(id: number): Promise<EngineResponse> {
  return request<EngineResponse>('/engine', { method: 'PATCH', params: { id, status: 'started' } });
}

export function stopEngine(id: number): Promise<EngineResponse> {
  return request<EngineResponse>('/engine', { method: 'PATCH', params: { id, status: 'stopped' } });
}

export function driveEngine(id: number): Promise<DriveResponse> {
  return request<DriveResponse>('/engine', { method: 'PATCH', params: { id, status: 'drive' } });
}
