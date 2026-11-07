import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { HIGH_LIMIT, LOW_LIMIT, getStatus } from "../utils/glucose";

const COLORS = {
  normal: "#059669",
  low: "#d97706",
  high: "#dc2626",
  none: "#94a3b8",
};

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { label, value } = payload[0].payload;
  if (value === null || value === undefined) return null;
  const status = getStatus(value);

  return (
    <div className="chart-tooltip">
      <div>{label}</div>
      <strong>{value} mg/dL</strong>
      <span className={`badge badge-${status.tone}`} style={{ marginTop: 6 }}>
        {status.label}
      </span>
    </div>
  );
}

const axisProps = {
  tick: { fill: "#64748b", fontSize: 12 },
  tickLine: false,
  axisLine: false,
};

// data: [{ label: string, value: number | null }]
// variant "bar" suits a few categories (one day), "line" suits a trend.
export default function GlucoseChart({ data, variant = "bar" }) {
  const maxValue = Math.max(0, ...data.map((item) => item.value ?? 0));
  const yMax = Math.max(250, Math.ceil((maxValue + 20) / 50) * 50);

  return (
    <>
      <div className="chart-box">
        <ResponsiveContainer width="100%" height="100%">
          {variant === "bar" ? (
            <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
              <CartesianGrid vertical={false} stroke="#e8edf3" />
              <XAxis dataKey="label" {...axisProps} />
              <YAxis domain={[0, yMax]} {...axisProps} />
              <ReferenceLine y={LOW_LIMIT} stroke="#d97706" strokeDasharray="4 4" />
              <ReferenceLine y={HIGH_LIMIT} stroke="#dc2626" strokeDasharray="4 4" />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(15,118,110,0.06)" }} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={56}>
                {data.map((item) => (
                  <Cell key={item.label} fill={COLORS[getStatus(item.value).key]} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -12 }}>
              <CartesianGrid vertical={false} stroke="#e8edf3" />
              <XAxis dataKey="label" {...axisProps} minTickGap={24} />
              <YAxis domain={[0, yMax]} {...axisProps} />
              <ReferenceArea
                y1={LOW_LIMIT}
                y2={HIGH_LIMIT}
                fill="#059669"
                fillOpacity={0.07}
              />
              <Tooltip content={<ChartTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#0f766e"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#0f766e", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
                connectNulls
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="chart-legend">
        <span className="legend-item">
          <span className="legend-dot" style={{ background: COLORS.normal }} />
          In range ({LOW_LIMIT}–{HIGH_LIMIT})
        </span>
        <span className="legend-item">
          <span className="legend-dot" style={{ background: COLORS.low }} />
          Low (&lt;{LOW_LIMIT})
        </span>
        <span className="legend-item">
          <span className="legend-dot" style={{ background: COLORS.high }} />
          High (&gt;{HIGH_LIMIT})
        </span>
      </div>
    </>
  );
}
