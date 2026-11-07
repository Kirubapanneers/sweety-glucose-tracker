import {
  Coffee,
  Droplets,
  Moon,
  Pencil,
  Sun,
  Sunrise,
  Trash2,
} from "lucide-react";
import { SLOTS, getStatus, slotIndex, slotLabel } from "../utils/glucose";

const slotIcons = {
  MORNING_FASTING: Sunrise,
  AFTER_BREAKFAST: Coffee,
  AFTER_LUNCH: Sun,
  AFTER_DINNER: Moon,
};

export default function ReadingList({
  readings,
  loading,
  editingId,
  onEdit,
  onDelete,
  dateLabel,
}) {
  const sorted = [...readings].sort(
    (a, b) => slotIndex(a.slot) - slotIndex(b.slot)
  );
  const progress = Math.round((readings.length / SLOTS.length) * 100);

  return (
    <section className="card" aria-labelledby="history-title">
      <div className="card-header">
        <div>
          <h2 className="card-title" id="history-title">
            Reading history
          </h2>
          <p className="card-subtitle">{dateLabel}</p>
        </div>
        <span className="badge badge-count">
          {loading ? "…" : `${readings.length} of ${SLOTS.length} recorded`}
        </span>
      </div>

      <div className="card-body">
        <div
          className="progress"
          role="progressbar"
          aria-label="Daily readings recorded"
          aria-valuemin={0}
          aria-valuemax={SLOTS.length}
          aria-valuenow={readings.length}
          style={{ marginTop: 0, marginBottom: 16 }}
        >
          <span style={{ width: `${progress}%` }} />
        </div>

        {loading ? (
          <div className="reading-list" aria-busy="true" aria-label="Loading readings">
            {[0, 1, 2].map((item) => (
              <div className="skeleton skeleton-row" key={item} />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">
              <Droplets size={26} aria-hidden="true" />
            </div>
            <h3>No readings for this date</h3>
            <p>
              Add your first glucose reading using the form to start tracking
              this day.
            </p>
          </div>
        ) : (
          <div className="reading-list">
            {sorted.map((reading) => {
              const Icon = slotIcons[reading.slot] || Droplets;
              const status = getStatus(reading.value);
              return (
                <div
                  className={`reading-row ${
                    editingId === reading.id ? "is-editing" : ""
                  }`}
                  key={reading.id}
                >
                  <div className="reading-icon">
                    <Icon size={20} aria-hidden="true" />
                  </div>

                  <div className="reading-main">
                    <div className="reading-slot">{slotLabel(reading.slot)}</div>
                    <div className="reading-value">
                      {reading.value}
                      <small>mg/dL</small>
                    </div>
                  </div>

                  <span className={`badge badge-${status.tone}`}>{status.label}</span>

                  <div className="reading-actions">
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => onEdit(reading)}
                      aria-label={`Edit ${slotLabel(reading.slot)} reading`}
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      className="icon-btn danger"
                      onClick={() => onDelete(reading)}
                      aria-label={`Delete ${slotLabel(reading.slot)} reading`}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
