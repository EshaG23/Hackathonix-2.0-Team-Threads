import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"

/* ---------------------------
   Health Color Logic
----------------------------*/
function getColor(avg) {
  if (avg == null) return "gray"
  if (avg > 50) return "red"
  if (avg > 25) return "orange"
  return "green"
}

export default function MapView({ lakesData, lakeHealthMap }) {
  return (
    <MapContainer
      center={[21.1458, 79.0882]}
      zoom={12}
      style={{ flex: 1 }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap"
      />

      {lakesData.map((lake) => {
        const health = lakeHealthMap[lake.lake_id]

        return (
          <CircleMarker
            key={lake.lake_id}
            center={[lake.latitude, lake.longitude]}
            radius={12}
            pathOptions={{
              color: getColor(health?.avg),
              fillColor: getColor(health?.avg),
              fillOpacity: 0.7
            }}
          >
            <Popup>
              <b>{lake.name}</b><br />
              Avg Plant %: {health?.avg?.toFixed(2) ?? "No Data"}<br />
              Reports: {health?.count ?? 0}
            </Popup>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}
