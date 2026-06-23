import { useEffect } from 'react';
import { useAppState } from '../../state/use-app-state';
import { getCars } from '../../api/garage';
import styles from './garage-view.module.css';

export function GarageView() {
  const { state, dispatch } = useAppState();
  const { page, total } = state.garage;

  useEffect(() => {
    void getCars(page).then(({ items, total: t }) => {
      dispatch({ type: 'SET_GARAGE_DATA', payload: { cars: items, total: t } });
    });
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
