import { AppProvider } from './state/context';
import { useAppState } from './state/use-app-state';
import { Nav } from './components/nav';
import { GarageView } from './features/garage/garage-view';
import { WinnersView } from './features/winners/winners-view';
import styles from './app.module.css';

function AppShell() {
  const { state } = useAppState();
  return (
    <div className={styles.shell}>
      <Nav />
      <main className={styles.main}>
        {state.view === 'garage' ? <GarageView /> : <WinnersView />}
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

export default App;
