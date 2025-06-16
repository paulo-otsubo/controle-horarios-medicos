import type { NextWebVitalsMetric } from 'next/app';
import { logEventSafe } from './lib/analytics';

export function reportWebVitals(metric: NextWebVitalsMetric) {
  const { id, name, value } = metric;
  // Normalizar valores (seg → ms etc.)
  const rounded = name === 'CLS' ? Math.round(value * 1000) : Math.round(value);
  logEventSafe(`web_vital_${name.toLowerCase()}`, {
    value: rounded,
    id
  });
}
