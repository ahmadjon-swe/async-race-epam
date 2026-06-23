export function animateCarToFinish(
  car: HTMLElement,
  track: HTMLElement,
  durationMs: number,
): void {
  const finishX = track.clientWidth - car.offsetWidth - 10;
  car.style.transition = `transform ${durationMs}ms linear`;
  car.style.transform = `translateX(${finishX}px)`;
}

export function freezeCarAtCurrentPosition(car: HTMLElement): void {
  const computed = window.getComputedStyle(car).transform;
  car.style.transition = 'none';
  car.style.transform = computed;
}

export function resetCarPosition(car: HTMLElement): void {
  car.style.transition = 'none';
  car.style.transform = 'translateX(0)';
}
