import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { setCars, setPage, setSelectedId } from '../../state/garage-slice';
import { getCars, deleteCar, createCar } from '../../api/garage';
import { deleteWinner } from '../../api/winners';
import { CARS_PER_PAGE, GENERATE_COUNT } from '../../utils/constants';
import { randomCarName, randomCarColor } from '../../utils/random-car';
import { CreateForm } from './create-form';
import { UpdateForm } from './update-form';
import { CarRow } from './car-row';
import { Pagination } from '../../components/pagination';
import styles from './garage-view.module.css';

export function GarageView() {
  const dispatch = useAppDispatch();
  const { cars, total, page, selectedId } = useAppSelector((state) => state.garage);
  const isRacing = useAppSelector((state) => state.race.isRacing);

  const loadPage = useCallback(
    (p: number) => {
      getCars(p)
        .then(({ items, total: t }) => {
          dispatch(setCars({ cars: items, total: t }));
        })
        .catch(() => {});
    },
    [dispatch],
  );

  useEffect(() => {
    loadPage(page);
  }, [page, loadPage]);

  const handleGenerate = () => {
    const requests = Array.from({ length: GENERATE_COUNT }, () =>
      createCar(randomCarName(), randomCarColor()),
    );
    Promise.all(requests)
      .then(() => loadPage(page))
      .catch(() => {});
  };

  const handleDelete = (id: number) => {
    if (id === selectedId) dispatch(setSelectedId(null));
    deleteCar(id)
      .then(() => deleteWinner(id).catch(() => {}))
      .then(() => {
        const isLastOnPage = cars.length === 1;
        const nextPage = isLastOnPage && page > 1 ? page - 1 : page;
        if (nextPage !== page) {
          dispatch(setPage(nextPage));
        } else {
          loadPage(page);
        }
      })
      .catch(() => {});
  };

  return (
    <div className={styles.view}>
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

      <div className={styles.carList}>
        {cars.length === 0 ? (
          <p className={styles.empty}>No cars in the garage. Create one above!</p>
        ) : (
          cars.map((car) => (
            <CarRow
              key={car.id}
              car={car}
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
