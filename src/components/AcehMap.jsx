import { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { useApp } from '../AppContext';

const MAP_WIDTH = 800;
const MAP_HEIGHT = 600;

// Hand-derived Mercator scale/center for the Aceh & North Sumatra bounding
// box (94–99.5°E, 1–6.8°N), independently verified via direct point
// projection (not via d3-geo's path.bounds()/path.area()/fitSize(), which
// proved unreliable for the real WDPA polygon data below — they reported
// self-consistent-looking but wrong bounds, which in turn fed a bad
// scale/translate into fitSize() and produced giant off-topology polygons
// covering large portions of the map). These values project the region's
// corners to sane on-canvas coordinates with an ~8% margin:
//   [94, 1]     -> [139, 576]  (near bottom-left)
//   [99.5, 6.8] -> [661, 24]   (near top-right)
//   center      -> [400, 300]  (exact canvas center)
const PROJECTION_CONFIG = { center: [96.75, 3.905008664093767], scale: 5438.005075042274 };

// Real coastline (MIT-licensed, @geo-maps/countries-land-10km, OSM/Natural
// Earth derived) clipped to Indonesia and re-projected/zoomed to Aceh &
// North Sumatra. Marker positions are regency-level centroids (real, named
// administrative districts) — not exact project site coordinates, which
// aren't publicly available for these projects. See the caption on the MSP
// page for that distinction.
const geoUrl = '/geo/indonesia-10km.json';

// Real protected-area boundaries from the World Database on Protected Areas
// (WDPA), UNEP-WCMC & IUCN, August 2026 release — downloaded directly from
// protectedplanet.net and clipped to the Aceh/North Sumatra bounding box.
// Geometry is simplified (Douglas-Peucker, ~200m tolerance) for web display;
// not survey-grade. Citation: UNEP-WCMC and IUCN (2026), Protected Planet:
// The World Database on Protected Areas (WDPA) [On-line], August 2026,
// Cambridge, UK: UNEP-WCMC and IUCN. Available at: www.protectedplanet.net.
//
// Rendered as pre-projected pixel-space SVG paths (built at data-prep time
// via the same PROJECTION_CONFIG below, point-by-point) rather than through
// react-simple-maps' <Geography>/d3-geo path pipeline: d3-geo's adaptive
// clip/resample algorithm corrupted several of these real WDPA polygons —
// a valid ring would render, then be silently followed by a second "ring"
// built from garbage coordinates thousands of pixels off-canvas — even
// after the scale/center bug above was fixed. Direct point projection
// (verified reliable throughout debugging) doesn't hit that code path.
const mpaPixelUrl = '/geo/aceh-mpas-pixels.json';

export default function AcehMap({ markers = [], onSelect, showMpa = true }) {
  const { t } = useApp();
  const [hovered, setHovered] = useState(null);
  const [mpas, setMpas] = useState([]);

  useEffect(() => {
    let cancelled = false;
    fetch(mpaPixelUrl)
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setMpas(d.features || []); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return (
    <div style={{ background: '#EAF4F8', borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={PROJECTION_CONFIG}
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        style={{ width: '100%', height: '320px' }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: { fill: '#DCEEF2', stroke: '#B9D6DC', strokeWidth: 0.6, outline: 'none' },
                  hover: { fill: '#DCEEF2', stroke: '#B9D6DC', strokeWidth: 0.6, outline: 'none' },
                  pressed: { fill: '#DCEEF2', outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>

        <g>
          {showMpa && mpas.map((f, i) => {
            if (!f.d) return null;
            const marine = f.properties.marine;
            const isHovered = hovered === f.properties;
            const fill = marine
              ? (isHovered ? 'rgba(18,153,155,.55)' : 'rgba(18,153,155,.32)')
              : (isHovered ? 'rgba(63,145,98,.5)' : 'rgba(63,145,98,.28)');
            const stroke = marine ? '#12999B' : '#3F9162';
            return (
              <path
                key={i}
                d={f.d}
                fill={fill}
                stroke={stroke}
                strokeWidth={isHovered ? 1.2 : 0.8}
                style={{ outline: 'none', cursor: 'default' }}
                onMouseEnter={() => setHovered(f.properties)}
                onMouseLeave={() => setHovered(null)}
              />
            );
          })}
        </g>

        {markers.map((m) => (
          <Marker key={m.id} coordinates={[m.lon, m.lat]} onClick={() => onSelect && onSelect(m)}>
            <circle r={6} fill="#12999B" stroke="white" strokeWidth={2} style={{ cursor: onSelect ? 'pointer' : 'default' }} />
          </Marker>
        ))}
      </ComposableMap>

      {hovered && (
        <div style={{
          position: 'absolute', bottom: 10, right: 12, maxWidth: 240,
          background: 'rgba(255,255,255,.96)', border: '1px solid var(--line)', borderRadius: 6,
          padding: '6px 9px', fontSize: '.58rem', color: 'var(--ink)', pointerEvents: 'none',
        }}>
          <div style={{ fontWeight: 700, color: 'var(--navy)' }}>{hovered.name}</div>
          <div style={{ color: 'var(--muted)', marginTop: 2 }}>
            {hovered.designation} · {hovered.marine ? t('msp.marine') : t('msp.terrestrial')} · {hovered.area_km2.toLocaleString()} km²
          </div>
        </div>
      )}

      <div style={{ position: 'absolute', bottom: 10, left: 12, fontSize: '.55rem', color: 'var(--muted)', background: 'rgba(255,255,255,.85)', padding: '4px 8px', borderRadius: 6 }}>
        {showMpa ? t('msp.legend') : t('msp.legendNoMpa')}
      </div>
    </div>
  );
}
