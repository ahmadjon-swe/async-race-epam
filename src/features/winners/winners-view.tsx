import { useEffect } from 'react';
import { useAppState } from '../../state/use-app-state';
import { getWinners } from '../../api/winners';
import { getCar } from '../../api/garage';
import type { WinnerRow } from '../../types';
import styles from './winners-view.module.css';

export function WinnersView() {
  const { state, dispatch } = useAppState();
  const { page, total, sort, order } = state.winners;

  useEffect(() => {
    void getWinners(page, sort, order).then(async ({ items, total: t }) => {
      const rows: WinnerRow[] = await Promise.all(
        items.map(async (w) => {
          const car = await getCar(w.id);
          return { ...w, name: car.name, color: car.color };
        }),
      );
      dispatch({ type: 'SET_WINNERS_DATA', payload: { items: rows, total: t } });
    });
  }, [page, sort, order, dispatch]);

  return (
    <div className={styles.view}>
      <h1 className={styles.title}>
        Winners <span className={styles.count}>({total})</span>
      </h1>
      <p className={styles.page}>Page #{page}</p>
    </div>
  );
}
