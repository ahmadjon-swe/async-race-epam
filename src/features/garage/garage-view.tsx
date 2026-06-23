import { useEffect, useRef, createRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { setPage } from '../../state/garage-slice';
import { CARS_PER_PAGE } from '../../utils/constants';
import { WinnerBanner } from '../race/winner-banner';
import { CreateForm } from './create-form';
import { UpdateForm } from './update-form';
import { GarageCarList } from './garage-car-list';
import { Pagination } from '../../components/pagination';
import { useGarageActions } from './use-garage-actions';
import styles from './garage-view.module.css';

export function GarageView() {
  const dispatch = useAppDispatch();
  const { cars, total, page } = useAppSelector((s) => s.garage);
  const { isRacing, winner } = useAppSelector((s) => s.race);

  const carRefs = useRef<Record<number, React.RefObject<HTMLDivElement | null>>>({});
  const trackRefs = useRef<Record<number, React.RefObject<HTMLDivElement | null>>>({});
  cars.forEach((car) => {
    if (!carRefs.current[car.id]) carRefs.current[car.id] = createRef();
    if (!trackRefs.current[car.id]) trackRefs.current[car.id] = createRef();
  });

  const { loadPage, handleDelete, handleGenerate, handleStartRace, handleResetRace } =
    useGarageActions(carRefs, trackRefs);

  useEffect(() => {
    loadPage(page);
  }, [page, loadPage]);

  return (
    <div className={styles.view}>
      <WinnerBanner winner={winner} />
      <h1 className={styles.title}>
        Garage <span className={styles.count}>({total})</span>
      </h1>
      <p className={styles.pageLabel}>Page #{page}</p>
      <div className={styles.forms}>
        <CreateForm onCreated={() => loadPage(page)} disabled={isRacing} />
        <UpdateForm onUpdated={() => loadPage(page)} disabled={isRacing} />
        <button
          type="button"
          className={styles.generateBtn}
          onClick={handleGenerate}
          disabled={isRacing}
        >
          Generate 100 Cars
        </button>
      </div>
      <div className={styles.raceControls}>
        <button
          type="button"
          className={styles.raceBtn}
          onClick={handleStartRace}
          disabled={isRacing || cars.length === 0}
        >
          Start Race
        </button>
        <button
          type="button"
          className={styles.resetBtn}
          onClick={handleResetRace}
          disabled={!isRacing}
        >
          Reset
        </button>
      </div>
      <div className={styles.carList}>
        <GarageCarList
          cars={cars}
          carRefs={carRefs.current}
          trackRefs={trackRefs.current}
          onDelete={handleDelete}
          disabled={isRacing}
        />
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
