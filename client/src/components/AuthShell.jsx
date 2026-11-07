import { Droplet, HeartPulse, ShieldCheck, ChartColumn } from "lucide-react";

const features = [
  { icon: HeartPulse, text: "Log four daily readings in seconds" },
  { icon: ChartColumn, text: "Spot trends with clear daily and monthly reports" },
  { icon: ShieldCheck, text: "Your readings are private to your account" },
];

export default function AuthShell({ children }) {
  return (
    <div className="auth-layout">
      <section className="auth-aside" aria-hidden="true">
        <div className="brand">
          <div className="brand-mark">
            <Droplet size={22} fill="currentColor" />
          </div>
          <div>
            <div className="brand-name">Sweety</div>
            <div className="brand-tag">Blood Glucose Tracker</div>
          </div>
        </div>

        <div className="auth-hero">
          <h2>Understand your glucose, one reading at a time.</h2>
          <p>
            A simple, secure way to record your blood glucose and see how it
            changes across the day, the month and beyond.
          </p>
          <ul className="feature-list">
            {features.map(({ icon: Icon, text }) => (
              <li key={text}>
                <span className="feature-icon">
                  <Icon size={18} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="auth-note">
          Sweety is a tracking tool and does not replace medical advice.
        </p>
      </section>

      <section className="auth-main">
        <div className="auth-card">
          <div className="brand auth-mobile-brand">
            <div className="brand-mark">
              <Droplet size={22} fill="currentColor" aria-hidden="true" />
            </div>
            <div>
              <div className="brand-name" style={{ color: "var(--text)" }}>
                Sweety
              </div>
              <div className="brand-tag" style={{ color: "var(--text-subtle)" }}>
                Blood Glucose Tracker
              </div>
            </div>
          </div>
          {children}
        </div>
      </section>
    </div>
  );
}
