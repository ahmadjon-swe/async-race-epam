import type { RefObject } from 'react';
import type { Car } from '../../types';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { setSelectedId } from '../../state/garage-slice';
import { setUpdateForm } from '../../state/form-slice';
import { CarIcon } from '../../components/car-icon';
import { useCarEngine } from './use-car-engine';
import styles from './car-row.module.css';

interface CarRowProps {
  car: Car;
  carRef: RefObject<HTMLDivElement | null>;
  trackRef: RefObject<HTMLDivElement | null>;
  onDelete: (id: number) => void;
  disabled?: boolean;
}

export function CarRow({ car, carRef, trackRef, onDelete, disabled }: CarRowProps) {
  const dispatch = useAppDispatch();
  const selectedId = useAppSelector((state) => state.garage.selectedId);
  const isSelected = selectedId === car.id;
  const { status, start, stop } = useCarEngine(car.id, carRef, trackRef);
  const isDriving = status === 'driving' || status === 'broken';

  const handleSelect = () => {
    dispatch(setSelectedId(car.id));
    dispatch(setUpdateForm({ name: car.name, color: car.color }));
  };

  return (
    <div className={`${styles.row} ${isSelected ? styles.selected : ''}`}>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.startBtn}
          onClick={start}
          disabled={disabled || isDriving}
        >
          A
        </button>
        <button
          type="button"
          className={styles.stopBtn}
          onClick={stop}
          disabled={disabled || status === 'idle'}
        >
          B
        </button>
        <button
          type="button"
          className={styles.selectBtn}
          onClick={handleSelect}
          disabled={disabled}
        >
          Select
        </button>
        <button
          type="button"
          className={styles.deleteBtn}
          onClick={() => onDelete(car.id)}
          disabled={disabled}
        >
          Remove
        </button>
        <span className={styles.name}>{car.name}</span>
      </div>
      <div className={styles.track} ref={trackRef}>
        <div className={styles.movingCar} ref={carRef}>
          <CarIcon color={car.color} width={80} />
        </div>
        <div className={styles.finish}>🏁</div>
      </div>
    </div>
  );
}
