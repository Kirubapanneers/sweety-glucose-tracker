import { useCallback, useEffect, useState } from "react";
import { ClipboardList, RefreshCw } from "lucide-react";
import api from "../services/api";
import AppLayout from "../components/AppLayout";
import ReportCard from "../components/ReportCard";
import Alert from "../components/Alert";
import { normalizeReport } from "../utils/reports";

const REPORTS = [
  {
    key: "daily",
    label: "Daily",
    endpoint: "/reports/daily",
    subtitle: "Today's readings at a glance.",
  },
  {
    key: "month-to-date",
    label: "Month to date",
    endpoint: "/reports/month-to-date",
    subtitle: "Your readings from the start of this month until today.",
  },
  {
    key: "previous-month",
    label: "Previous month",
    endpoint: "/reports/previous-month",
    subtitle: "A look back at last month.",
  },
];

export default function Reports() {
  const [activeKey, setActiveKey] = useState(REPORTS[0].key);
  // Cache per report: { [key]: { status, data, error } }
  const [results, setResults] = useState({});

  const active = REPORTS.find((report) => report.key === activeKey);
  const current = results[activeKey];

  const loadReport = useCallback(async (report) => {
    setResults((previous) => ({
      ...previous,
      [report.key]: { status: "loading" },
    }));

    try {
      const response = await api.get(report.endpoint);
      setResults((previous) => ({
        ...previous,
        [report.key]: {
          status: "ready",
          data: normalizeReport(
            response.data,
            report.key === "daily" ? "daily" : "range"
          ),
        },
      }));
    } catch (error) {
      setResults((previous) => ({
        ...previous,
        [report.key]: {
          status: "error",
          error: error.response?.data?.message || "Unable to load report",
        },
      }));
    }
  }, []);

  useEffect(() => {
    if (!results[activeKey]) loadReport(active);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey]);

  const isLoading = !current || current.status === "loading";

  return (
    <AppLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">{active.subtitle}</p>
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => loadReport(active)}
          disabled={isLoading}
        >
          <RefreshCw size={16} aria-hidden="true" />
          Refresh
        </button>
      </div>

      <div className="report-toolbar">
        <div className="tabs" role="tablist" aria-label="Report period">
          {REPORTS.map((report) => (
            <button
              key={report.key}
              type="button"
              role="tab"
              id={`tab-${report.key}`}
              aria-selected={report.key === activeKey}
              aria-controls="report-panel"
              className="tab"
              onClick={() => setActiveKey(report.key)}
            >
              {report.label}
            </button>
          ))}
        </div>
      </div>

      <div id="report-panel" role="tabpanel" aria-labelledby={`tab-${activeKey}`}>
        {isLoading ? (
          <div aria-busy="true" aria-label="Loading report">
            <div className="stat-grid">
              {[0, 1, 2, 3].map((item) => (
                <div className="skeleton" style={{ height: 94 }} key={item} />
              ))}
            </div>
            <div className="skeleton" style={{ height: 340 }} />
          </div>
        ) : current.status === "error" ? (
          <Alert type="error">
            {current.error}{" "}
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ marginLeft: 8 }}
              onClick={() => loadReport(active)}
            >
              Try again
            </button>
          </Alert>
        ) : !current.data.hasData ? (
          <section className="card">
            <div className="empty">
              <div className="empty-icon">
                <ClipboardList size={26} aria-hidden="true" />
              </div>
              <h3>No readings in this period</h3>
              <p>
                Add readings from the dashboard and they will show up in this
                report.
              </p>
            </div>
          </section>
        ) : (
          <ReportCard
            report={current.data}
            kind={activeKey === "daily" ? "daily" : "range"}
          />
        )}
      </div>
    </AppLayout>
  );
}
