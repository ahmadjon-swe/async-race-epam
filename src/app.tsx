import { Provider } from 'react-redux';
import { store } from './state/store';
import { Nav } from './components/nav';
import { GarageView } from './features/garage/garage-view';
import { WinnersView } from './features/winners/winners-view';
import { useAppSelector } from './state/hooks';
import styles from './app.module.css';

function AppShell() {
  const view = useAppSelector((state) => state.view);
  return (
    <div className={styles.shell}>
      <Nav />
      <main className={styles.main}>
        {view === 'garage' ? <GarageView /> : <WinnersView />}
      </main>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppShell />
    </Provider>
  );
}

export default App;
