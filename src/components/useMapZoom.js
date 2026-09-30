import { useState } from 'react';

const MIN_ZOOM = 1;
const MAX_ZOOM = 8;
const STEP = 1.6;

export function useMapZoom() {
  const [zoom, setZoom] = useState(1);
  const zoomIn = () => setZoom((z) => Math.min(MAX_ZOOM, +(z * STEP).toFixed(3)));
  const zoomOut = () => setZoom((z) => Math.max(MIN_ZOOM, +(z / STEP).toFixed(3)));
  const reset = () => setZoom(1);
  return { zoom, setZoom, zoomIn, zoomOut, reset, minZoom: MIN_ZOOM, maxZoom: MAX_ZOOM };
}
