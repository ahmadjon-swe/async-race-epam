import { useAppState } from '../state/use-app-state';
import styles from './nav.module.css';

export function Nav() {
  const { state, dispatch } = useAppState();

  return (
    <nav className={styles.nav}>
      <button
        type="button"
        className={state.view === 'garage' ? styles.active : styles.link}
        onClick={() => dispatch({ type: 'SET_VIEW', payload: 'garage' })}
      >
        Garage
      </button>
      <button
        type="button"
        className={state.view === 'winners' ? styles.active : styles.link}
        onClick={() => dispatch({ type: 'SET_VIEW', payload: 'winners' })}
      >
        Winners
      </button>
    </nav>
  );
}
