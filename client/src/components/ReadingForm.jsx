import { Coffee, Moon, Pencil, Plus, Sun, Sunrise, X } from "lucide-react";
import Alert from "./Alert";
import {
  MAX_GLUCOSE,
  MIN_GLUCOSE,
  SLOTS,
  getStatus,
  slotLabel,
  today,
} from "../utils/glucose";

const slotIcons = {
  MORNING_FASTING: Sunrise,
  AFTER_BREAKFAST: Coffee,
  AFTER_LUNCH: Sun,
  AFTER_DINNER: Moon,
};

export function validateValue(rawValue) {
  if (rawValue === "" || rawValue === null || rawValue === undefined) {
    return "";
  }
  const number = Number(rawValue);
  if (!Number.isInteger(number)) return "Enter a whole number (no decimals).";
  if (number < MIN_GLUCOSE || number > MAX_GLUCOSE) {
    return `Value must be between ${MIN_GLUCOSE} and ${MAX_GLUCOSE} mg/dL.`;
  }
  return "";
}

export default function ReadingForm({
  date,
  onDateChange,
  slot,
  onSlotChange,
  value,
  onValueChange,
  usedSlots,
  editingId,
  saving,
  error,
  message,
  onDismissError,
  onDismissMessage,
  onSubmit,
  onCancel,
}) {
  const availableCount = SLOTS.filter((s) => !usedSlots.includes(s.value)).length;
  const allFilled = availableCount === 0 && !editingId;
  const valueError = validateValue(value);
  const status = value !== "" && !valueError ? getStatus(Number(value)) : null;
  const dateInFuture = date > today();

  const submitDisabled =
    saving || allFilled || value === "" || Boolean(valueError) || dateInFuture;

  return (
    <section className="card" aria-labelledby="form-title">
      <div className="card-header">
        <div>
          <h2 className="card-title" id="form-title">
            {editingId ? "Edit reading" : "Add glucose reading"}
          </h2>
          <p className="card-subtitle">
            {editingId
              ? "Update the value for this reading."
              : "Record a new blood glucose measurement."}
          </p>
        </div>
      </div>

      <div className="card-body">
        <form className="form-stack" onSubmit={onSubmit} noValidate>
          {error && (
            <Alert type="error" onClose={onDismissError}>
              {error}
            </Alert>
          )}
          {message && (
            <Alert type="success" onClose={onDismissMessage}>
              {message}
            </Alert>
          )}

          {editingId && (
            <div className="editing-banner">
              <Pencil size={16} aria-hidden="true" />
              Editing {slotLabel(slot)}
            </div>
          )}

          <div className="field">
            <label htmlFor="reading-date">Reading date</label>
            <input
              id="reading-date"
              className={`input ${dateInFuture ? "invalid" : ""}`}
              type="date"
              value={date}
              max={today()}
              onChange={(event) => onDateChange(event.target.value)}
              required
            />
            {dateInFuture && (
              <span className="field-error">Future dates are not allowed.</span>
            )}
          </div>

          <fieldset
            style={{ border: 0, margin: 0, padding: 0, minWidth: 0 }}
            className="field"
          >
            <legend className="field-label" style={{ padding: 0, marginBottom: 6 }}>
              Reading slot
            </legend>
            <div className="slot-grid">
              {SLOTS.map((item) => {
                const Icon = slotIcons[item.value];
                const taken = usedSlots.includes(item.value);
                return (
                  <label className="slot-option" key={item.value}>
                    <input
                      type="radio"
                      name="slot"
                      value={item.value}
                      checked={slot === item.value}
                      disabled={taken}
                      onChange={() => onSlotChange(item.value)}
                    />
                    <span className="slot-tile">
                      <Icon size={20} aria-hidden="true" />
                      <span className="slot-name">{item.label}</span>
                      <span className="slot-state">
                        {taken ? "Already recorded" : "Available"}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
            {allFilled && (
              <span className="field-hint">
                All four reading slots are filled for this date. Edit or delete a
                reading to change it.
              </span>
            )}
          </fieldset>

          <div className="field">
            <label htmlFor="reading-value">Glucose level</label>
            <div className="value-input-wrap">
              <input
                id="reading-value"
                className={`input ${valueError ? "invalid" : ""}`}
                type="number"
                inputMode="numeric"
                min={MIN_GLUCOSE}
                max={MAX_GLUCOSE}
                step="1"
                placeholder={`${MIN_GLUCOSE}–${MAX_GLUCOSE}`}
                value={value}
                onChange={(event) => onValueChange(event.target.value)}
                aria-invalid={Boolean(valueError)}
                aria-describedby="value-help"
                required
              />
              <span className="value-unit">mg/dL</span>
            </div>
            <div id="value-help" className="live-status">
              {valueError ? (
                <span className="field-error">{valueError}</span>
              ) : status ? (
                <>
                  <span className={`badge badge-${status.tone}`}>{status.label}</span>
                  <span>for this reading</span>
                </>
              ) : (
                <span>Whole numbers from {MIN_GLUCOSE} to {MAX_GLUCOSE}.</span>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={submitDisabled}>
              {saving ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Saving...
                </>
              ) : editingId ? (
                <>
                  <Pencil size={16} aria-hidden="true" />
                  Update reading
                </>
              ) : (
                <>
                  <Plus size={16} aria-hidden="true" />
                  Add reading
                </>
              )}
            </button>

            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
                disabled={saving}
              >
                <X size={16} aria-hidden="true" />
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
