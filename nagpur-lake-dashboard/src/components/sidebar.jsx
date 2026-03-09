const getCategory = (avg) => {
  if (avg == null) return "NO_DATA";
  if (avg > 50) return "CRITICAL";
  if (avg > 25) return "MODERATE";
  return "HEALTHY";
};

// --- Modular Sub-Components ---

const HealthProgressBar = ({ percentage, color }) => (
  <div style={progressContainerStyle}>
    <div
      style={{
        ...progressBarStyle,
        width: `${Math.min(percentage, 100)}%`,
        backgroundColor: color,
        boxShadow: `0 0 8px ${color}66`
      }}
    />
  </div>
);

const LakeCard = ({ name, avg, count, color }) => (
  <div style={cardStyle}>
    <div style={cardHeaderStyle}>
      <span style={lakeNameStyle}>{name}</span>
      <span style={{ ...countBadgeStyle, backgroundColor: `${color}15`, color: color }}>
        {count} reports
      </span>
    </div>
    <div style={statsContainerStyle}>
      <span style={avgTextStyle}>Hyacinth Index: {avg.toFixed(1)}%</span>
    </div>
    <HealthProgressBar percentage={avg} color={color} />
  </div>
);

const CategoryGroup = ({ title, lakes, color, icon }) => {
  if (lakes.length === 0) return null;

  return (
    <div style={groupContainerStyle}>
      <h3 style={{ ...groupTitleStyle, color: color }}>
        <span style={{ marginRight: '8px' }}>{icon}</span>
        {title}
      </h3>
      {lakes.map((lake, index) => (
        <LakeCard key={index} {...lake} color={color} />
      ))}
    </div>
  );
};

// --- Main Sidebar Component ---

export default function Sidebar({ lakesData, lakeHealthMap }) {
  const categories = {
    critical: { title: "Critical Status", lakes: [], color: "#ef4444", icon: "🔴" },
    moderate: { title: "Moderate Status", lakes: [], color: "#f59e0b", icon: "🟠" },
    healthy: { title: "Healthy Status", lakes: [], color: "#10b981", icon: "🟢" }
  };

  lakesData.forEach((lake) => {
    const health = lakeHealthMap[lake.lake_id];
    if (!health) return;

    const categoryKey = getCategory(health.avg).toLowerCase();
    if (categories[categoryKey]) {
      categories[categoryKey].lakes.push({
        name: lake.name,
        avg: health.avg,
        count: health.count
      });
    }
  });

  return (
    <div style={sidebarWrapperStyle}>
      <header style={sidebarHeaderStyle}>
        <h2 style={sidebarTitleStyle}>Lake Monitoring</h2>
        <p style={sidebarSubtitleStyle}>Real-time health analytics</p>
      </header>

      <div style={scrollAreaStyle}>
        <CategoryGroup {...categories.critical} />
        <CategoryGroup {...categories.moderate} />
        <CategoryGroup {...categories.healthy} />

        {Object.values(categories).every(c => c.lakes.length === 0) && (
          <div style={emptyStateStyle}>
            <p>No health report data available</p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Styles ---

const sidebarWrapperStyle = {
  width: "320px",
  height: "100%",
  background: "#ffffff",
  display: "flex",
  flexDirection: "column",
  borderRight: "1px solid #e2e8f0",
  boxShadow: "4px 0 20px rgba(0,0,0,0.02)",
  fontFamily: "'Plus Jakarta Sans', sans-serif"
};

const sidebarHeaderStyle = {
  padding: "40px 20px 24px",
  borderBottom: "1px solid #f1f5f9",
  background: "linear-gradient(to bottom, #ffffff, #f8fafc)"
};

const sidebarTitleStyle = {
  fontSize: "1.25rem",
  fontWeight: "800",
  color: "#0f172a",
  margin: 0,
  letterSpacing: "-0.02em"
};

const sidebarSubtitleStyle = {
  fontSize: "0.85rem",
  color: "#64748b",
  marginTop: "4px",
  fontWeight: "500"
};

const scrollAreaStyle = {
  flex: 1,
  overflowY: "auto",
  padding: "16px",
  maxHeight: "calc(100vh - 140px)" // Ensuring it fits within viewport
};

const groupContainerStyle = {
  marginBottom: "32px"
};

const groupTitleStyle = {
  fontSize: "0.9rem",
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: "16px",
  display: "flex",
  alignItems: "center"
};

const cardStyle = {
  background: "#ffffff",
  borderRadius: "16px",
  padding: "16px",
  marginBottom: "12px",
  border: "1px solid #f1f5f9",
  boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
  transition: "all 0.2s ease"
};

const cardHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "12px"
};

const lakeNameStyle = {
  fontSize: "0.95rem",
  fontWeight: "700",
  color: "#1e293b",
  flex: 1,
  paddingRight: "8px"
};

const countBadgeStyle = {
  fontSize: "0.7rem",
  fontWeight: "700",
  padding: "4px 8px",
  borderRadius: "20px",
  whiteSpace: "nowrap"
};

const statsContainerStyle = {
  marginBottom: "8px"
};

const avgTextStyle = {
  fontSize: "0.8rem",
  color: "#64748b",
  fontWeight: "600"
};

const progressContainerStyle = {
  height: "6px",
  width: "100%",
  background: "#f1f5f9",
  borderRadius: "10px",
  overflow: "hidden"
};

const progressBarStyle = {
  height: "100%",
  borderRadius: "10px",
  transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
};

const emptyStateStyle = {
  textAlign: "center",
  padding: "40px 20px",
  color: "#94a3b8",
  fontSize: "0.9rem"
};
