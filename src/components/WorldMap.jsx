import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { CAPITALS } from '../data/capitals';

// ISO alpha-3 -> ISO numeric-3 (only need the countries present in our dataset;
// unmatched geographies render in the neutral "no data" color)
export const ALPHA3_TO_NUMERIC = {
  IDN: '360',
  VNM: '704',
  PHL: '608',
  KOR: '410',
  JPN: '392',
  KEN: '404',
  AUS: '036',
  BRA: '076',
  MEX: '484',
  CHL: '152',
};

export const STATUS_COLOR = {
  Implemented: '#2E8B62',
  'In Development': '#159A9C',
  Planned: '#D28A2E',
  'Not Available': '#AEB9BE',
  'No Data': '#E5EAED',
};

const geoUrl = '/geo/countries-110m.json';

export default function WorldMap({ countries, statusField, onSelect, selectedIso, colorMap, mutedIsos, markers, onMarkerSelect, selectedMarkerId, showCapitals = true }) {
  const palette = colorMap || STATUS_COLOR;
  const numericToRow = {};
  countries.forEach((c) => {
    const num = ALPHA3_TO_NUMERIC[c.iso];
    if (num) numericToRow[num] = c;
  });
  const trackedIsos = new Set(countries.map((c) => c.iso));
  const capitals = showCapitals ? CAPITALS.filter((c) => trackedIsos.has(c.iso)) : [];

  return (
    <div style={{ background: '#EAF4F8', borderRadius: 8, overflow: 'hidden' }}>
      <ComposableMap
        projection="geoNaturalEarth1"
        style={{ width: '100%', height: '390px' }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const row = numericToRow[geo.id];
              const value = row ? row[statusField] : null;
              const fill = value ? palette[value] || '#E5EAED' : '#F5F8F9';
              const isSelected = row && row.iso === selectedIso;
              const isMuted = row && mutedIsos && mutedIsos.has(row.iso);
              const opacity = isMuted ? 0.35 : 1;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => row && onSelect && onSelect(row.country)}
                  style={{
                    default: {
                      fill,
                      opacity,
                      stroke: '#D6E1E5',
                      strokeWidth: isSelected ? 1.5 : 0.5,
                      outline: 'none',
                      cursor: row ? 'pointer' : 'default',
                    },
                    hover: {
                      fill: row ? '#12999B' : fill,
                      opacity: 1,
                      stroke: '#D6E1E5',
                      strokeWidth: 0.5,
                      outline: 'none',
                      cursor: row ? 'pointer' : 'default',
                    },
                    pressed: { fill: '#0B3150', opacity: 1, outline: 'none' },
                  }}
                />
              );
            })
          }
        </Geographies>

        {capitals.map((c) => (
          <Marker key={c.iso} coordinates={[c.lon, c.lat]}>
            <circle r={2} fill="#5B6B73" stroke="white" strokeWidth={0.6} style={{ pointerEvents: 'none' }} />
            <text
              y={-5}
              textAnchor="middle"
              style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 7, fontWeight: 600, fill: '#4A5A63', pointerEvents: 'none' }}
            >
              {c.name}
            </text>
          </Marker>
        ))}

        {markers && markers.map((m) => (
          <Marker key={m.id} coordinates={[m.lon, m.lat]} onClick={() => onMarkerSelect && onMarkerSelect(m)}>
            <circle
              r={selectedMarkerId === m.id ? 7 : 5.5}
              fill="#12999B"
              stroke="white"
              strokeWidth={1.5}
              style={{ cursor: onMarkerSelect ? 'pointer' : 'default' }}
            />
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
}
