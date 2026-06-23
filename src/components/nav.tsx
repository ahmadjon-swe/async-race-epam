import { useAppDispatch, useAppSelector } from '../state/hooks';
import { setView } from '../state/view-slice';
import styles from './nav.module.css';

export function Nav() {
  const dispatch = useAppDispatch();
  const view = useAppSelector((state) => state.view);

  return (
    <nav className={styles.nav}>
      <button
        type="button"
        className={view === 'garage' ? styles.active : styles.link}
        onClick={() => dispatch(setView('garage'))}
      >
        Garage
      </button>
      <button
        type="button"
        className={view === 'winners' ? styles.active : styles.link}
        onClick={() => dispatch(setView('winners'))}
      >
        Winners
      </button>
    </nav>
  );
}
