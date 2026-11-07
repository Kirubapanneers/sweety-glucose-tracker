import {
  Activity,
  CalendarDays,
  ClipboardList,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import StatCard from "./StatCard";
import GlucoseChart from "./GlucoseChart";
import {
  formatDate,
  getStatus,
  slotIndex,
  slotLabel,
} from "../utils/glucose";

export default function ReportCard({ report, kind }) {
  const { stats, readings, series, periodLabel } = report;
  const avgStatus = getStatus(stats.average);
  const isDaily = kind === "daily";

  const sortedReadings = [...readings].sort((a, b) => {
    if (a.date !== b.date) return (b.date || "").localeCompare(a.date || "");
    return slotIndex(a.slot) - slotIndex(b.slot);
  });

  return (
    <>
      {periodLabel && (
        <div className="report-toolbar">
          <span className="period-chip">
            <CalendarDays size={16} aria-hidden="true" />
            {periodLabel}
          </span>
        </div>
      )}

      <div className="stat-grid">
        <StatCard
          icon={Activity}
          label="Average"
          value={stats.average}
          unit="mg/dL"
          hint={stats.average !== null ? avgStatus.label : "No data"}
          tone={stats.average !== null ? avgStatus.tone : "default"}
        />
        <StatCard
          icon={TrendingUp}
          label="Highest"
          value={stats.max}
          unit="mg/dL"
          tone={stats.max !== null ? getStatus(stats.max).tone : "default"}
        />
        <StatCard
          icon={TrendingDown}
          label="Lowest"
          value={stats.min}
          unit="mg/dL"
          tone={stats.min !== null ? getStatus(stats.min).tone : "default"}
        />
        <StatCard
          icon={stats.inRangePercent !== null ? Target : ClipboardList}
          label={stats.inRangePercent !== null ? "Time in range" : "Readings"}
          value={stats.inRangePercent !== null ? `${stats.inRangePercent}%` : stats.count}
          hint={
            stats.inRangePercent !== null && stats.count !== null
              ? `${stats.count} readings`
              : undefined
          }
          tone="info"
        />
      </div>

      {series.length > 0 && (
        <section className="card" style={{ marginBottom: 20 }}>
          <div className="card-header">
            <div>
              <h2 className="card-title">
                {isDaily ? "Readings by slot" : "Daily average trend"}
              </h2>
              <p className="card-subtitle">
                {isDaily
                  ? "Each reading recorded today."
                  : "Average glucose for each day with readings."}
              </p>
            </div>
          </div>
          <div className="card-body">
            <GlucoseChart data={series} variant={isDaily ? "bar" : "line"} />
          </div>
        </section>
      )}

      {sortedReadings.length > 0 && (
        <section className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Readings</h2>
              <p className="card-subtitle">
                {sortedReadings.length} reading
                {sortedReadings.length === 1 ? "" : "s"} in this period.
              </p>
            </div>
          </div>
          <div className="card-body table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Slot</th>
                  <th scope="col">Value</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {sortedReadings.map((reading, index) => {
                  const status = getStatus(reading.value);
                  return (
                    <tr key={reading.id ?? `${reading.date}-${reading.slot}-${index}`}>
                      <td>{formatDate(reading.date)}</td>
                      <td>{slotLabel(reading.slot)}</td>
                      <td>
                        <strong>{reading.value}</strong> mg/dL
                      </td>
                      <td>
                        <span className={`badge badge-${status.tone}`}>
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <p className="disclaimer">
        Colour coding uses an indicative 70–180 mg/dL range for tracking only.
        Follow your doctor's targets and advice.
      </p>
    </>
  );
}
