import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { setWinners } from '../../state/winners-slice';
import { getWinners } from '../../api/winners';
import { getCar } from '../../api/garage';
import type { WinnerRow } from '../../types';
import { WinnersTable } from './winners-table';
import styles from './winners-view.module.css';

export function WinnersView() {
  const dispatch = useAppDispatch();
  const { page, total, sort, order } = useAppSelector((state) => state.winners);

  useEffect(() => {
    getWinners(page, sort, order)
      .then(({ items, total: t }) =>
        Promise.all(
          items.map((w) =>
            getCar(w.id)
              .then((car): WinnerRow => ({ ...w, name: car.name, color: car.color }))
              .catch(() => null),
          ),
        ).then((rows) => {
          dispatch(setWinners({ items: rows.filter((r): r is WinnerRow => r !== null), total: t }));
        }),
      )
      .catch(() => {});
  }, [page, sort, order, dispatch]);

  return (
    <div className={styles.view}>
      <h1 className={styles.title}>
        Winners <span className={styles.count}>({total})</span>
      </h1>
      <p className={styles.pageLabel}>Page #{page}</p>
      <WinnersTable />
    </div>
  );
}
