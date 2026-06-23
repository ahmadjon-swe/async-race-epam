import styles from './winner-banner.module.css';

interface WinnerBannerProps {
  winner: { name: string; time: number } | null;
}

export function WinnerBanner({ winner }: WinnerBannerProps) {
  if (!winner) return null;
  return (
    <div className={styles.banner}>
      🏆 {winner.name} went first ({winner.time.toFixed(2)}s)!
    </div>
  );
}
