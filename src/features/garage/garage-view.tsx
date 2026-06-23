import { useEffect, useCallback, useRef, createRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { setCars, setPage, setSelectedId, resetAllCarStates } from '../../state/garage-slice';
import { startRace, setWinner, resetRace } from '../../state/race-slice';
import { getCars, deleteCar, createCar } from '../../api/garage';
import { deleteWinner } from '../../api/winners';
import { CARS_PER_PAGE, GENERATE_COUNT } from '../../utils/constants';
import { randomCarName, randomCarColor } from '../../utils/random-car';
import { raceSingleCar, stopAllCars, persistWinner } from '../race/race-service';
import { WinnerBanner } from '../race/winner-banner';
import { CreateForm } from './create-form';
import { UpdateForm } from './update-form';
import { CarRow } from './car-row';
import { Pagination } from '../../components/pagination';
import styles from './garage-view.module.css';

export function GarageView() {
  const dispatch = useAppDispatch();
  const { cars, total, page, selectedId } = useAppSelector((s) => s.garage);
  const { isRacing, winner } = useAppSelector((s) => s.race);

  const carRefs = useRef<Record<number, React.RefObject<HTMLDivElement | null>>>({});
  const trackRefs = useRef<Record<number, React.RefObject<HTMLDivElement | null>>>({});

  cars.forEach((car) => {
    if (!carRefs.current[car.id]) carRefs.current[car.id] = createRef();
    if (!trackRefs.current[car.id]) trackRefs.current[car.id] = createRef();
  });

  const loadPage = useCallback(
    (p: number) => {
      getCars(p)
        .then(({ items, total: t }) => dispatch(setCars({ cars: items, total: t })))
        .catch(() => {});
    },
    [dispatch],
  );

  useEffect(() => { loadPage(page); }, [page, loadPage]);

  const handleDelete = (id: number) => {
    if (id === selectedId) dispatch(setSelectedId(null));
    deleteCar(id)
      .then(() => deleteWinner(id).catch(() => {}))
      .then(() => {
        const isLast = cars.length === 1;
        const next = isLast && page > 1 ? page - 1 : page;
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
        const winnerCar = cars.find((c) => c.id === id);
        if (winnerCar) {
          dispatch(setWinner({ name: winnerCar.name, time: timeSec }));
          persistWinner(id, timeSec).catch(() => {});
        }
      })
      .catch(() => {});
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

  return (
    <div className={styles.view}>
      <WinnerBanner winner={winner} />
      <h1 className={styles.title}>Garage <span className={styles.count}>({total})</span></h1>
      <p className={styles.pageLabel}>Page #{page}</p>

      <div className={styles.forms}>
        <CreateForm onCreated={() => loadPage(page)} disabled={isRacing} />
        <UpdateForm onUpdated={() => loadPage(page)} disabled={isRacing} />
        <button type="button" className={styles.generateBtn} onClick={handleGenerate} disabled={isRacing}>
          Generate 100 Cars
        </button>
      </div>

      <div className={styles.raceControls}>
        <button type="button" className={styles.raceBtn} onClick={handleStartRace} disabled={isRacing || cars.length === 0}>
          Start Race
        </button>
        <button type="button" className={styles.resetBtn} onClick={handleResetRace} disabled={!isRacing}>
          Reset
        </button>
      </div>

      <div className={styles.carList}>
        {cars.length === 0 ? (
          <p className={styles.empty}>No cars in the garage. Create one above!</p>
        ) : (
          cars.map((car) => (
            <CarRow
              key={car.id}
              car={car}
              carRef={carRefs.current[car.id]}
              trackRef={trackRefs.current[car.id]}
              onDelete={handleDelete}
              disabled={isRacing}
            />
          ))
        )}
      </div>

      <Pagination
        page={page}
        total={total}
        perPage={CARS_PER_PAGE}
        onPrev={() => dispatch(setPage(page - 1))}
        onNext={() => dispatch(setPage(page + 1))}
        disabled={isRacing}
      />
    </div>
  );
}
