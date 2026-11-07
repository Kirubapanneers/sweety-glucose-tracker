import { CircleAlert, CircleCheck, Info, X } from "lucide-react";

const icons = {
  error: CircleAlert,
  success: CircleCheck,
  info: Info,
};

export default function Alert({ type = "info", children, onClose }) {
  const Icon = icons[type] || Info;

  return (
    <div
      className={`alert alert-${type}`}
      role={type === "error" ? "alert" : "status"}
    >
      <Icon size={18} aria-hidden="true" />
      <div className="alert-body">{children}</div>
      {onClose && (
        <button
          type="button"
          className="alert-close"
          onClick={onClose}
          aria-label="Dismiss message"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
