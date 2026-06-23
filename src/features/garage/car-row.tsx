import type { Car } from '../../types';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { setSelectedId } from '../../state/garage-slice';
import { setUpdateForm } from '../../state/form-slice';
import { CarIcon } from '../../components/car-icon';
import styles from './car-row.module.css';

interface CarRowProps {
  car: Car;
  onDelete: (id: number) => void;
  disabled?: boolean;
}

export function CarRow({ car, onDelete, disabled }: CarRowProps) {
  const dispatch = useAppDispatch();
  const selectedId = useAppSelector((state) => state.garage.selectedId);
  const isSelected = selectedId === car.id;

  const handleSelect = () => {
    dispatch(setSelectedId(car.id));
    dispatch(setUpdateForm({ name: car.name, color: car.color }));
  };

  return (
    <div className={`${styles.row} ${isSelected ? styles.selected : ''}`}>
      <div className={styles.controls}>
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
      </div>
      <div className={styles.track}>
        <div className={styles.carWrap}>
          <CarIcon color={car.color} />
        </div>
        <span className={styles.name}>{car.name}</span>
      </div>
    </div>
  );
}
