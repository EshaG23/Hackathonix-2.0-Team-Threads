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
      const reportsByLake = {}

      snapshot.forEach((doc) => {
        const data = doc.data()
        const lakeId = data.lake_id
        if (data.plant_percentage == null) return

        if (!reportsByLake[lakeId]) {
          reportsByLake[lakeId] = []
        }
        reportsByLake[lakeId].push({
          plant: data.plant_percentage,
          time: data.timestamp || data.createdAt || 0
        })
      })

      const avgMap = {}
      Object.keys(reportsByLake).forEach((lakeId) => {
        // Sort reports by time to ensure weighted average (EMA) is correct
        const sortedReports = reportsByLake[lakeId].sort((a, b) => a.time - b.time)
        
        // Calculate Weighted Average (EMA)
        // Formula: CurrentEMA = (Value * 0.8) + (PrevEMA * 0.2)
        let currentEma = 0
        sortedReports.forEach((report, index) => {
          if (index === 0) {
            currentEma = report.plant
          } else {
            currentEma = (report.plant * 0.2) + (currentEma * 0.8)
          }
        })

        avgMap[lakeId] = {
          avg: currentEma,
          count: sortedReports.length
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
