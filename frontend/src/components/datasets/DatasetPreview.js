"use client";

export default function DatasetPreview({ data, filename }) {
  if (!data || !data.headers || !data.rows) {
    return (
      <div className="p-6 text-center text-sm text-muted-foreground">
        No preview available
      </div>
    );
  }

  return (
    <div className="overflow-auto">
      {filename && (
        <div className="px-4 py-2 border-b border-border text-sm font-medium">
          {filename}
          <span className="text-muted-foreground ml-2">
            ({data.rows.length} rows)
          </span>
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted">
            {data.headers.map((h, i) => (
              <th
                key={i}
                className="text-left px-4 py-2 font-medium text-foreground"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.slice(0, 50).map((row, ri) => (
            <tr
              key={ri}
              className="border-b border-border hover:bg-muted/50 transition-colors"
            >
              {data.headers.map((h, ci) => (
                <td key={ci} className="px-4 py-2 text-foreground">
                  {row[h] ?? row[ci] ?? ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.rows.length > 50 && (
        <div className="px-4 py-2 text-xs text-muted-foreground">
          Showing first 50 of {data.rows.length} rows
        </div>
      )}
    </div>
  );
}
