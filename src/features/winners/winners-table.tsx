import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { setSort, setPage } from '../../state/winners-slice';
import type { WinnerSortField, SortOrder } from '../../types';
import { CarIcon } from '../../components/car-icon';
import { Pagination } from '../../components/pagination';
import { WINNERS_PER_PAGE } from '../../utils/constants';
import styles from './winners-table.module.css';

function SortIcon({ field, active, order }: { field: WinnerSortField; active: WinnerSortField; order: SortOrder }) {
  if (field !== active) return null;
  return <span className={styles.sortIcon}>{order === 'ASC' ? '▲' : '▼'}</span>;
}

export function WinnersTable() {
  const dispatch = useAppDispatch();
  const { items, total, page, sort, order } = useAppSelector((s) => s.winners);

  const handleSort = (field: WinnerSortField) => {
    const nextOrder: SortOrder = sort === field && order === 'ASC' ? 'DESC' : 'ASC';
    dispatch(setSort({ sort: field, order: nextOrder }));
  };

  const rowOffset = (page - 1) * WINNERS_PER_PAGE;

  return (
    <div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>№</th>
            <th className={styles.th}>Car</th>
            <th className={styles.th}>Name</th>
            <th className={`${styles.th} ${styles.sortable}`} onClick={() => handleSort('wins')}>
              Wins <SortIcon field="wins" active={sort} order={order} />
            </th>
            <th className={`${styles.th} ${styles.sortable}`} onClick={() => handleSort('time')}>
              Best time (s) <SortIcon field="time" active={sort} order={order} />
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((row, i) => (
            <tr key={row.id} className={styles.tr}>
              <td className={styles.td}>{rowOffset + i + 1}</td>
              <td className={styles.td}><CarIcon color={row.color} width={60} /></td>
              <td className={styles.td}>{row.name}</td>
              <td className={styles.td}>{row.wins}</td>
              <td className={styles.td}>{row.time.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {items.length === 0 && <p className={styles.empty}>No winners yet. Run a race!</p>}

      <Pagination
        page={page}
        total={total}
        perPage={WINNERS_PER_PAGE}
        onPrev={() => dispatch(setPage(page - 1))}
        onNext={() => dispatch(setPage(page + 1))}
      />
    </div>
  );
}
