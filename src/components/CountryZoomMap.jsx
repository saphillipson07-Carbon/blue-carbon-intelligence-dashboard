import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { ALPHA3_TO_NUMERIC } from './WorldMap';

const geoUrl = '/geo/countries-110m.json';

// Hand-computed per-country Mercator center/scale, derived from the same
// real 110m atlas boundaries rendered here (Natural Earth-derived, the same
// file WorldMap uses for the global choropleth). Values were computed once,
// offline, via d3-geo's path.bounds() on a unit-scale Mercator projection
// applied to each country's own real feature geometry — the standard,
// reliable way to fit a projection to a feature — then converted to a
// center + scale that fits an ~88%-margin 800x420 canvas. This is plain
// topojson consumed through react-simple-maps' normal Geography/d3-geo
// pipeline, unlike the custom pre-projected WDPA pixel data in AcehMap.
const PROJECTIONS = {
  IDN: { center: [118.164, -2.464], scale: 881.89 },
  VNM: { center: [105.753, 16.114], scale: 1375.58 },
  PHL: { center: [121.856, 12.121], scale: 1598.72 },
  KOR: { center: [127.794, 36.53], scale: 4029.07 },
  JPN: { center: [137.476, 38.657], scale: 1137.74 },
  KEN: { center: [37.874, 0.417], scale: 2076.92 },
  AUS: { center: [133.453, -28.418], scale: 559.31 },
  BRA: { center: [-54.359, -15.15], scale: 514.46 },
  MEX: { center: [-101.971, 23.95], scale: 1060.85 },
  CHL: { center: [-71.302, -39.093], scale: 429.15 },
};

export default function CountryZoomMap({ iso, markers = [], onMarkerSelect, selectedMarkerId }) {
  const config = PROJECTIONS[iso];
  const numId = ALPHA3_TO_NUMERIC[iso];
  if (!config) return null;

  return (
    <div style={{ background: '#EAF4F8', borderRadius: 8, overflow: 'hidden' }}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={config}
        width={800}
        height={420}
        style={{ width: '100%', height: '340px' }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const isSelected = geo.id === numId;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: {
                      fill: isSelected ? '#DCEEF2' : '#EFF4F6',
                      stroke: isSelected ? '#8FB9C4' : '#D6E1E5',
                      strokeWidth: isSelected ? 0.9 : 0.5,
                      outline: 'none',
                    },
                    hover: {
                      fill: isSelected ? '#DCEEF2' : '#EFF4F6',
                      stroke: isSelected ? '#8FB9C4' : '#D6E1E5',
                      strokeWidth: isSelected ? 0.9 : 0.5,
                      outline: 'none',
                    },
                    pressed: { outline: 'none' },
                  }}
                />
              );
            })
          }
        </Geographies>

        {markers.map((m) => (
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
