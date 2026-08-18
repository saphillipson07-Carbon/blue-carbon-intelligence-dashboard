import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

// ISO alpha-3 -> ISO numeric-3 (only need the countries present in our dataset;
// unmatched geographies render in the neutral "no data" color)
const ALPHA3_TO_NUMERIC = {
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

const STATUS_COLOR = {
  Implemented: '#2E8B62',
  'In Development': '#159A9C',
  Planned: '#D28A2E',
  'Not Available': '#AEB9BE',
  'No Data': '#E5EAED',
};

const geoUrl = '/geo/countries-110m.json';

export default function WorldMap({ countries, statusField, onSelect, selectedIso }) {
  const numericToRow = {};
  countries.forEach((c) => {
    const num = ALPHA3_TO_NUMERIC[c.iso];
    if (num) numericToRow[num] = c;
  });

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
              const fill = value ? STATUS_COLOR[value] || '#E5EAED' : '#F5F8F9';
              const isSelected = row && row.iso === selectedIso;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => row && onSelect && onSelect(row.country)}
                  style={{
                    default: {
                      fill,
                      stroke: '#D6E1E5',
                      strokeWidth: isSelected ? 1.5 : 0.5,
                      outline: 'none',
                      cursor: row ? 'pointer' : 'default',
                    },
                    hover: {
                      fill: row ? '#12999B' : fill,
                      stroke: '#D6E1E5',
                      strokeWidth: 0.5,
                      outline: 'none',
                      cursor: row ? 'pointer' : 'default',
                    },
                    pressed: { fill: '#0B3150', outline: 'none' },
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
