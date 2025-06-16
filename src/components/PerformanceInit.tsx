'use client';

import { useEffect } from 'react';
import { initPerformance } from '../lib/performance';

export default function PerformanceInit() {
  useEffect(() => {
    initPerformance();
  }, []);
  return null;
}
