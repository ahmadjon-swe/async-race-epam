import { useCallback } from 'react';
import type { RefObject } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { setCars, setPage, setSelectedId, resetAllCarStates } from '../../state/garage-slice';
import { startRace, setWinner, resetRace } from '../../state/race-slice';
import { getCars, deleteCar, createCar } from '../../api/garage';
import { deleteWinner } from '../../api/winners';
import { GENERATE_COUNT } from '../../utils/constants';
import { randomCarName, randomCarColor } from '../../utils/random-car';
import { raceSingleCar, stopAllCars, persistWinner } from '../race/race-service';

export function useGarageActions(
  carRefs: RefObject<Record<number, RefObject<HTMLDivElement | null>>>,
  trackRefs: RefObject<Record<number, RefObject<HTMLDivElement | null>>>,
) {
  const dispatch = useAppDispatch();
  const { cars, page, selectedId } = useAppSelector((s) => s.garage);

  const loadPage = useCallback(
    (p: number) => {
      getCars(p)
        .then(({ items, total: t }) => dispatch(setCars({ cars: items, total: t })))
        .catch(() => {});
    },
    [dispatch],
  );

  const handleDelete = (id: number) => {
    if (id === selectedId) dispatch(setSelectedId(null));
    deleteCar(id)
      .then(() => deleteWinner(id).catch(() => {}))
      .then(() => {
        const carMap = carRefs.current;
        const trackMap = trackRefs.current;
        delete carMap[id];
        delete trackMap[id];
        const next = cars.length === 1 && page > 1 ? page - 1 : page;
        if (next !== page) dispatch(setPage(next));
        else loadPage(page);
      })
      .catch(() => {});
  };

  const handleGenerate = () => {
    Promise.all(
      Array.from({ length: GENERATE_COUNT }, () => createCar(randomCarName(), randomCarColor())),
    )
      .then(() => loadPage(page))
      .catch(() => {});
  };

  const handleStartRace = () => {
    dispatch(startRace());
    const promises = cars.map((car) =>
      raceSingleCar(
        car.id,
        carRefs.current[car.id]?.current ?? null,
        trackRefs.current[car.id]?.current ?? null,
        dispatch,
      ),
    );
    Promise.any(promises)
      .then(({ id, timeSec }) => {
        const w = cars.find((c) => c.id === id);
        if (w) {
          dispatch(setWinner({ name: w.name, time: timeSec }));
          persistWinner(id, timeSec).catch(() => {});
        }
      })
      .catch(() => {
        dispatch(resetRace());
      });
  };

  const handleResetRace = () => {
    stopAllCars(
      cars.map((c) => c.id),
      (id) => carRefs.current[id]?.current ?? null,
    )
      .then(() => {
        dispatch(resetAllCarStates());
        dispatch(resetRace());
      })
      .catch(() => {});
  };

  return { loadPage, handleDelete, handleGenerate, handleStartRace, handleResetRace };
}
