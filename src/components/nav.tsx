import { useAppDispatch, useAppSelector } from '../state/hooks';
import { setView } from '../state/view-slice';
import styles from './nav.module.css';

export function Nav() {
  const dispatch = useAppDispatch();
  const view = useAppSelector((state) => state.view);
  const isRacing = useAppSelector((state) => state.race.isRacing);

  return (
    <nav className={styles.nav}>
      <button
        type="button"
        className={view === 'garage' ? styles.active : styles.link}
        onClick={() => dispatch(setView('garage'))}
        disabled={isRacing}
      >
        Garage
      </button>
      <button
        type="button"
        className={view === 'winners' ? styles.active : styles.link}
        onClick={() => dispatch(setView('winners'))}
        disabled={isRacing}
      >
        Winners
      </button>
    </nav>
  );
}
