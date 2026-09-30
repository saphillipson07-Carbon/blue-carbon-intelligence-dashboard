export default function MapZoomControls({ zoom, minZoom, maxZoom, onZoomIn, onZoomOut, onReset }) {
  return (
    <div className="map-zoom-controls">
      <button className="map-zoom-btn" onClick={onZoomIn} disabled={zoom >= maxZoom} aria-label="Zoom in">+</button>
      <button className="map-zoom-btn" onClick={onZoomOut} disabled={zoom <= minZoom} aria-label="Zoom out">−</button>
      <button className="map-zoom-btn map-zoom-reset" onClick={onReset} disabled={zoom === 1} aria-label="Reset zoom">⟲</button>
    </div>
  );
}
