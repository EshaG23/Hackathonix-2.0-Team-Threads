import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import lakesData from "./data/lakes.json"
import Sidebar from "./components/sidebar"
import MapView from "./components/Mapview"
import { db } from "./firebase"
import { collection, onSnapshot } from "firebase/firestore"
import { sendCriticalLakeEmail } from "./utils/sendEmails"

function App() {
  const navigate = useNavigate()
  const [lakeHealthMap, setLakeHealthMap] = useState({})
  const prevAvgRef = useRef({})

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "reports"), (snapshot) => {
      const aggregation = {}

      snapshot.forEach((doc) => {
        const data = doc.data()
        const lakeId = data.lake_id
        const plant = data.plant_percentage

        if (plant == null) return

        if (!aggregation[lakeId]) {
          aggregation[lakeId] = { sum: 0, count: 0 }
        }

        aggregation[lakeId].sum += plant
        aggregation[lakeId].count += 1
      })

      const avgMap = {}
      Object.keys(aggregation).forEach((lakeId) => {
        avgMap[lakeId] = {
          avg: aggregation[lakeId].sum / aggregation[lakeId].count,
          count: aggregation[lakeId].count
        }
      })

      /* --------------------------------
         🔥 CRITICAL CROSSING DETECTION
      --------------------------------- */
      Object.keys(avgMap).forEach((lakeId) => {
        const avg = avgMap[lakeId].avg
        const prevAvg = prevAvgRef.current[lakeId] ?? avg

        const lake = lakesData.find(l => l.lake_id === lakeId)
        if (!lake) return

        // 🚨 ONLY WHEN IT CROSSES 50
        if (prevAvg <= 50 && avg > 50) {
          console.log("🚨 CRITICAL CROSSED:", lake.name, avg)
          sendCriticalLakeEmail(lake.name, avg)
        }

        // update previous avg
        prevAvgRef.current[lakeId] = avg
      })

      setLakeHealthMap(avgMap)
    })

    return () => unsub()
  }, [])

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Navbar />

      {/* BODY - Flex adjustment to account for fixed navbar */}
      <div style={{ flex: 1, display: "flex", marginTop: "70px" }}>
        <Sidebar
          lakesData={lakesData}
          lakeHealthMap={lakeHealthMap}
        />

        <MapView
          lakesData={lakesData}
          lakeHealthMap={lakeHealthMap}
        />
      </div>
    </div>
  )
}

export default App
