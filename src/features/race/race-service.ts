import type { AppDispatch } from '../../state/store';
import { setCarStatus } from '../../state/garage-slice';

import { startEngine, driveEngine, stopEngine } from '../../api/engine';
import { getWinner, createWinner, updateWinner } from '../../api/winners';
import {
  animateCarToFinish,
  freezeCarAtCurrentPosition,
  resetCarPosition,
} from '../../utils/car-animation';

export interface RaceResult {
  id: number;
  timeSec: number;
}

export function raceSingleCar(
  id: number,
  carEl: HTMLElement | null,
  trackEl: HTMLElement | null,
  dispatch: AppDispatch,
): Promise<RaceResult> {
  dispatch(setCarStatus({ id, status: 'driving' }));

  return startEngine(id)
    .then(({ velocity, distance }) => {
      const durationMs = distance / velocity;
      if (carEl && trackEl) animateCarToFinish(carEl, trackEl, durationMs);

      return driveEngine(id)
        .then(() => ({ id, timeSec: durationMs / 1000 }))
        .catch((err: Error & { status?: number }) => {
          if (carEl) freezeCarAtCurrentPosition(carEl);
          dispatch(setCarStatus({ id, status: 'broken' }));
          throw err;
        });
    })
    .catch((err: Error & { status?: number }) => {
      if (err.status !== 500) {
        dispatch(setCarStatus({ id, status: 'idle' }));
      }
      throw err;
    });
}

export function stopAllCars(
  ids: number[],
  getCarEl: (id: number) => HTMLElement | null,
): Promise<void> {
  const stops = ids.map((id) =>
    stopEngine(id)
      .then(() => {
        const el = getCarEl(id);
        if (el) resetCarPosition(el);
      })
      .catch(() => {}),
  );
  return Promise.all(stops).then(() => {});
}

export async function persistWinner(id: number, timeSec: number): Promise<void> {
  try {
    const existing = await getWinner(id);
    await updateWinner(id, existing.wins + 1, Math.min(existing.time, timeSec));
  } catch (err: unknown) {
    if ((err as Error & { status?: number }).status === 404) {
      await createWinner(id, 1, timeSec);
    }
  }
}
