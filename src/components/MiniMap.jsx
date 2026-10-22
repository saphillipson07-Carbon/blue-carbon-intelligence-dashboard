import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { ALPHA3_TO_NUMERIC, STATUS_COLOR } from './WorldMap';

const geoUrl = '/geo/countries-110m.json';

// A small, non-interactive map thumbnail for cards — same geography and
// color logic as the full WorldMap, but no zoom controls, markers, or
// click handling, so it reads as a preview rather than a second map to use.
export default function MiniMap({ countries, statusField }) {
  const numericToRow = {};
  countries.forEach((c) => {
    const num = ALPHA3_TO_NUMERIC[c.iso];
    if (num) numericToRow[num] = c;
  });

  return (
    <div style={{ background: '#EAF4F8', borderRadius: '7px 7px 0 0', overflow: 'hidden', pointerEvents: 'none' }}>
      <ComposableMap projection="geoNaturalEarth1" style={{ width: '100%', height: '72px', display: 'block' }}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const row = numericToRow[geo.id];
              const value = row ? row[statusField] : null;
              const fill = value ? STATUS_COLOR[value] || '#E5EAED' : '#F5F8F9';
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: { fill, stroke: '#D6E1E5', strokeWidth: 0.4, outline: 'none' },
                    hover: { fill, stroke: '#D6E1E5', strokeWidth: 0.4, outline: 'none' },
                    pressed: { fill, outline: 'none' },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
