import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { setCars } from '../../state/garage-slice';
import { getCars } from '../../api/garage';
import styles from './garage-view.module.css';

export function GarageView() {
  const dispatch = useAppDispatch();
  const { page, total } = useAppSelector((state) => state.garage);

  useEffect(() => {
    getCars(page)
      .then(({ items, total: t }) => {
        dispatch(setCars({ cars: items, total: t }));
      })
      .catch(() => {});
  }, [page, dispatch]);

  return (
    <div className={styles.view}>
      <h1 className={styles.title}>
        Garage <span className={styles.count}>({total})</span>
      </h1>
      <p className={styles.page}>Page #{page}</p>
    </div>
  );
}
