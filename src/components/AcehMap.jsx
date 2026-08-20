import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

// Real coastline (MIT-licensed, @geo-maps/countries-land-10km, OSM/Natural
// Earth derived) clipped to Indonesia and re-projected/zoomed to Aceh &
// North Sumatra. Marker positions are regency-level centroids (real, named
// administrative districts) — not exact project site coordinates, which
// aren't publicly available for these projects. See the caption on the MSP
// page for that distinction.
const geoUrl = '/geo/indonesia-10km.json';

export default function AcehMap({ markers = [], onSelect }) {
  return (
    <div style={{ background: '#EAF4F8', borderRadius: 8, overflow: 'hidden' }}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [96.6, 4.3], scale: 4600 }}
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
        {markers.map((m) => (
          <Marker key={m.id} coordinates={[m.lon, m.lat]} onClick={() => onSelect && onSelect(m)}>
            <circle r={6} fill="#12999B" stroke="white" strokeWidth={2} style={{ cursor: onSelect ? 'pointer' : 'default' }} />
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
}
