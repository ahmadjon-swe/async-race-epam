import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { setCreateForm } from '../../state/form-slice';
import { createCar } from '../../api/garage';
import styles from './car-form.module.css';

interface CreateFormProps {
  onCreated: () => void;
  disabled?: boolean;
}

export function CreateForm({ onCreated, disabled }: CreateFormProps) {
  const dispatch = useAppDispatch();
  const { name, color } = useAppSelector((state) => state.form.create);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createCar(name.trim(), color)
      .then(() => {
        dispatch(setCreateForm({ name: '', color: '#000000' }));
        onCreated();
      })
      .catch(() => {});
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.nameInput}
        type="text"
        placeholder="Car name"
        value={name}
        onChange={(e) => dispatch(setCreateForm({ name: e.target.value }))}
        disabled={disabled}
        maxLength={50}
      />
      <input
        className={styles.colorInput}
        type="color"
        value={color}
        onChange={(e) => dispatch(setCreateForm({ color: e.target.value }))}
        disabled={disabled}
      />
      <button className={styles.submitBtn} type="submit" disabled={disabled || !name.trim()}>
        Create
      </button>
    </form>
  );
}
