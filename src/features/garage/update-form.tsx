import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { setUpdateForm } from '../../state/form-slice';
import { setSelectedId } from '../../state/garage-slice';
import { updateCar } from '../../api/garage';
import styles from './car-form.module.css';

interface UpdateFormProps {
  onUpdated: () => void;
  disabled?: boolean;
}

export function UpdateForm({ onUpdated, disabled }: UpdateFormProps) {
  const dispatch = useAppDispatch();
  const { name, color } = useAppSelector((state) => state.form.update);
  const selectedId = useAppSelector((state) => state.garage.selectedId);
  const isActive = selectedId !== null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActive || !name.trim()) return;
    updateCar(selectedId, name.trim(), color)
      .then(() => {
        dispatch(setSelectedId(null));
        dispatch(setUpdateForm({ name: '', color: '#000000' }));
        onUpdated();
      })
      .catch(() => {});
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.nameInput}
        type="text"
        placeholder="Select a car to edit"
        value={name}
        onChange={(e) => dispatch(setUpdateForm({ name: e.target.value }))}
        disabled={disabled || !isActive}
        maxLength={50}
      />
      <input
        className={styles.colorInput}
        type="color"
        value={color}
        onChange={(e) => dispatch(setUpdateForm({ color: e.target.value }))}
        disabled={disabled || !isActive}
      />
      <button
        className={styles.submitBtn}
        type="submit"
        disabled={disabled || !isActive || !name.trim()}
      >
        Update
      </button>
    </form>
  );
}
