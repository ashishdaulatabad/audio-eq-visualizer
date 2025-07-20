export function timerSec(timeInSeconds: number) {
  const m = Math.floor(timeInSeconds / 60)
  const s = Math.floor(timeInSeconds) % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function linearToCubic(number: number, peak = 256, factor = 1): number {
  const real = number / (peak * factor);
  return real * real * real * peak;
}

export function linearToPower(number: number, power: number, peak = 256, factor = 1): number {
  const real = number / (peak * factor);
  return Math.pow(real, power) * peak;
}

export function linearToSquare(number: number, peak = 256, factor = 1): number {
  const real = number / (peak * factor);
  return real * real * peak;
}
