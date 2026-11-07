export default function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  hint,
  tone = "default",
  loading = false,
}) {
  return (
    <div className="stat-card">
      <div className={`stat-icon tone-${tone}`}>
        <Icon size={22} aria-hidden="true" />
      </div>
      <div className="stat-content">
        <div className="stat-label">{label}</div>
        {loading ? (
          <div
            className="skeleton"
            style={{ width: 72, height: 28, marginTop: 6 }}
            aria-label="Loading"
          />
        ) : (
          <div className="stat-value">
            {value ?? "—"}
            {unit && value !== null && value !== undefined && (
              <span className="stat-unit">{unit}</span>
            )}
          </div>
        )}
        {hint && !loading && <div className="stat-hint">{hint}</div>}
      </div>
    </div>
  );
}
