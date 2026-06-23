import type { RefObject } from 'react';
import type { Car } from '../../types';
import { CarRow } from './car-row';
import styles from './garage-view.module.css';

interface GarageCarListProps {
  cars: Car[];
  carRefs: Record<number, RefObject<HTMLDivElement | null>>;
  trackRefs: Record<number, RefObject<HTMLDivElement | null>>;
  onDelete: (id: number) => void;
  disabled: boolean;
}

export function GarageCarList({
  cars,
  carRefs,
  trackRefs,
  onDelete,
  disabled,
}: GarageCarListProps) {
  if (cars.length === 0) {
    return <p className={styles.empty}>No cars in the garage. Create one above!</p>;
  }
  return (
    <>
      {cars.map((car) => (
        <CarRow
          key={car.id}
          car={car}
          carRef={carRefs[car.id]}
          trackRef={trackRefs[car.id]}
          onDelete={onDelete}
          disabled={disabled}
        />
      ))}
    </>
  );
}
