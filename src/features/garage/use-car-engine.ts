import { useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { setCarStatus } from '../../state/garage-slice';
import type { CarEngineStatus } from '../../state/garage-slice';
import { startEngine, stopEngine, driveEngine } from '../../api/engine';
import {
  animateCarToFinish,
  freezeCarAtCurrentPosition,
  resetCarPosition,
} from '../../utils/car-animation';

interface UseCarEngineResult {
  status: CarEngineStatus;
  start: () => void;
  stop: () => void;
}

export function useCarEngine(
  id: number,
  carRef: React.RefObject<HTMLElement | null>,
  trackRef: React.RefObject<HTMLElement | null>,
): UseCarEngineResult {
  const dispatch = useAppDispatch();
  const status = useAppSelector((s) => s.garage.carStates[id] ?? 'idle');
  const cancelledRef = useRef(false);

  const start = useCallback(() => {
    if (status !== 'idle') return;
    cancelledRef.current = false;

    startEngine(id)
      .then(({ velocity, distance }) => {
        if (cancelledRef.current) return;
        dispatch(setCarStatus({ id, status: 'driving' }));
        const car = carRef.current;
        const track = trackRef.current;
        if (car && track) animateCarToFinish(car, track, distance / velocity);

        driveEngine(id).catch((err: Error & { status?: number }) => {
          if (cancelledRef.current) return;
          if (err.status === 500 && carRef.current) {
            freezeCarAtCurrentPosition(carRef.current);
            dispatch(setCarStatus({ id, status: 'broken' }));
          }
        });
      })
      .catch(() => {});
  }, [id, status, dispatch, carRef, trackRef]);

  const stop = useCallback(() => {
    cancelledRef.current = true;
    stopEngine(id)
      .then(() => {
        if (carRef.current) resetCarPosition(carRef.current);
        dispatch(setCarStatus({ id, status: 'idle' }));
      })
      .catch(() => {});
  }, [id, dispatch, carRef]);

  return { status, start, stop };
}
