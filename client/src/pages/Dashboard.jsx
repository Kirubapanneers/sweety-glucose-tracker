import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, CalendarDays, ClipboardList, TrendingDown, TrendingUp } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import AppLayout from "../components/AppLayout";
import StatCard from "../components/StatCard";
import ReadingForm, { validateValue } from "../components/ReadingForm";
import ReadingList from "../components/ReadingList";
import GlucoseChart from "../components/GlucoseChart";
import ConfirmDialog from "../components/ConfirmDialog";
import Alert from "../components/Alert";
import {
  SLOTS,
  average,
  formatDate,
  getGreeting,
  getStatus,
  slotIndex,
  today,
} from "../utils/glucose";

export default function Dashboard() {
  const { user } = useAuth();

  const [date, setDate] = useState(today());
  const [value, setValue] = useState("");
  const [slot, setSlot] = useState(SLOTS[0].value);
  const [readings, setReadings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loadingReadings, setLoadingReadings] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchReadings = useCallback(async () => {
    try {
      const response = await api.get("/readings", {
        params: { date },
      });
      setReadings(response.data.readings || []);
      setLoadError("");
    } catch (error) {
      setLoadError(
        error.response?.data?.message || "Unable to load readings"
      );
    } finally {
      setLoadingReadings(false);
    }
  }, [date]);

  useEffect(() => {
    setLoadingReadings(true);
    fetchReadings();
  }, [fetchReadings]);

  // Success messages dismiss themselves.
  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(() => setMessage(""), 4000);
    return () => clearTimeout(timer);
  }, [message]);

  const usedSlots = useMemo(
    () =>
      readings
        .filter((reading) => reading.id !== editingId)
        .map((reading) => reading.slot),
    [readings, editingId]
  );

  // Keep the selected slot valid: if it is already taken for this date, move
  // to the first free one.
  useEffect(() => {
    if (loadingReadings || !usedSlots.includes(slot)) return;
    const firstFree = SLOTS.find((item) => !usedSlots.includes(item.value));
    if (firstFree) setSlot(firstFree.value);
  }, [usedSlots, slot, loadingReadings]);

  const resetForm = () => {
    setValue("");
    setEditingId(null);
    setSlot(SLOTS[0].value);
  };

  const handleDateChange = (nextDate) => {
    if (!nextDate) return;
    setDate(nextDate);
    setError("");
    setMessage("");
    // Changing the date while editing would apply the edit to another day.
    if (editingId) resetForm();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const validationMessage = validateValue(value);
    if (validationMessage) {
      setError(validationMessage);
      return;
    }
    if (date > today()) {
      setError("Future dates are not allowed.");
      return;
    }

    setSaving(true);

    try {
      const readingData = {
        value: Number(value),
        date,
        slot,
      };

      if (editingId) {
        await api.put(`/readings/${editingId}`, readingData);
        setMessage("Reading updated successfully");
      } else {
        await api.post("/readings", readingData);
        setMessage("Reading added successfully");
      }

      resetForm();
      await fetchReadings();
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to save reading"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (reading) => {
    setEditingId(reading.id);
    setValue(String(reading.value));
    setDate(reading.date.slice(0, 10));
    setSlot(reading.slot);
    setError("");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    resetForm();
    setError("");
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;

    setDeleting(true);
    try {
      setError("");
      setMessage("");
      await api.delete(`/readings/${pendingDelete.id}`);
      if (pendingDelete.id === editingId) resetForm();
      setMessage("Reading deleted successfully");
      setPendingDelete(null);
      await fetchReadings();
    } catch (error) {
      setPendingDelete(null);
      setError(
        error.response?.data?.message || "Unable to delete reading"
      );
    } finally {
      setDeleting(false);
    }
  };

  // Summary figures for the selected date, calculated from the loaded readings.
  const values = readings.map((reading) => Number(reading.value));
  const avg = average(values);
  const highest = values.length ? Math.max(...values) : null;
  const lowest = values.length ? Math.min(...values) : null;

  const chartData = SLOTS.map((item) => {
    const match = readings.find((reading) => reading.slot === item.value);
    return { label: item.short, value: match ? Number(match.value) : null };
  });

  const isToday = date === today();
  const dateLabel = isToday ? `Today, ${formatDate(date)}` : formatDate(date);
  const firstName = (user?.name || "there").split(" ")[0];

  return (
    <AppLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {getGreeting()}, {firstName}
          </h1>
          <p className="page-subtitle">
            Here is your glucose overview for {isToday ? "today" : formatDate(date)}.
          </p>
        </div>

        <div className="field header-date">
          <label htmlFor="filter-date">
            <span className="sr-only">Select date</span>
          </label>
          <div className="input-wrap">
            <CalendarDays className="input-icon" size={18} aria-hidden="true" />
            <input
              id="filter-date"
              className="input with-icon"
              type="date"
              value={date}
              max={today()}
              onChange={(event) => handleDateChange(event.target.value)}
              aria-label="Select date"
            />
          </div>
        </div>
      </div>

      {loadError && (
        <div style={{ marginBottom: 20 }}>
          <Alert type="error">
            {loadError}{" "}
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ marginLeft: 8 }}
              onClick={() => {
                setLoadingReadings(true);
                fetchReadings();
              }}
            >
              Retry
            </button>
          </Alert>
        </div>
      )}

      <div className="stat-grid">
        <StatCard
          icon={ClipboardList}
          label="Readings logged"
          value={`${readings.length}/${SLOTS.length}`}
          hint={
            readings.length === SLOTS.length
              ? "All slots recorded"
              : `${SLOTS.length - readings.length} remaining`
          }
          tone="info"
          loading={loadingReadings}
        />
        <StatCard
          icon={Activity}
          label="Average"
          value={avg}
          unit="mg/dL"
          hint={avg !== null ? getStatus(avg).label : "No readings yet"}
          tone={avg !== null ? getStatus(avg).tone : "default"}
          loading={loadingReadings}
        />
        <StatCard
          icon={TrendingUp}
          label="Highest"
          value={highest}
          unit="mg/dL"
          tone={highest !== null ? getStatus(highest).tone : "default"}
          loading={loadingReadings}
        />
        <StatCard
          icon={TrendingDown}
          label="Lowest"
          value={lowest}
          unit="mg/dL"
          tone={lowest !== null ? getStatus(lowest).tone : "default"}
          loading={loadingReadings}
        />
      </div>

      <div className="dashboard-grid">
        <ReadingForm
          date={date}
          onDateChange={handleDateChange}
          slot={slot}
          onSlotChange={setSlot}
          value={value}
          onValueChange={setValue}
          usedSlots={usedSlots}
          editingId={editingId}
          saving={saving}
          error={error}
          message={message}
          onDismissError={() => setError("")}
          onDismissMessage={() => setMessage("")}
          onSubmit={handleSubmit}
          onCancel={handleCancelEdit}
        />

        <div className="stack">
          <section className="card" aria-labelledby="chart-title">
            <div className="card-header">
              <div>
                <h2 className="card-title" id="chart-title">
                  Glucose across the day
                </h2>
                <p className="card-subtitle">{dateLabel}</p>
              </div>
            </div>
            <div className="card-body">
              {loadingReadings ? (
                <div className="skeleton" style={{ height: 280 }} aria-busy="true" />
              ) : readings.length === 0 ? (
                <div className="empty">
                  <div className="empty-icon">
                    <Activity size={26} aria-hidden="true" />
                  </div>
                  <h3>Nothing to chart yet</h3>
                  <p>Your readings for this date will appear here once you add them.</p>
                </div>
              ) : (
                <GlucoseChart data={chartData} variant="bar" />
              )}
            </div>
          </section>

          <ReadingList
            readings={readings}
            loading={loadingReadings}
            editingId={editingId}
            onEdit={handleEdit}
            onDelete={setPendingDelete}
            dateLabel={dateLabel}
          />
        </div>
      </div>

      {pendingDelete && (
        <ConfirmDialog
          title="Delete this reading?"
          message={`This will permanently remove the ${
            SLOTS[slotIndex(pendingDelete.slot)]?.label || "selected"
          } reading of ${pendingDelete.value} mg/dL. This cannot be undone.`}
          busy={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </AppLayout>
  );
}
