"use client";

export default function PageHeader({ title, description, actions }) {
  return (
    <div
      className="flex items-center justify-between px-8 py-5 bg-white"
      style={{ borderBottom: "2px solid var(--bauhaus-black)" }}
    >
      <div>
        <div className="flex items-center gap-3">
          {/* Bauhaus accent bar before title */}
          <span
            className="bauhaus-accent-bar"
            style={{ width: "5px", height: "28px" }}
          />
          <h1
            className="text-xl"
            style={{
              fontWeight: "900",
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
            }}
          >
            {title}
          </h1>
        </div>
        {description && (
          <p
            className="text-sm mt-1"
            style={{
              color: "var(--muted-foreground)",
              marginLeft: "17px",
              fontWeight: "400",
            }}
          >
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
