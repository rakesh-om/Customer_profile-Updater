import { useEffect, useMemo, useState } from "react";

export function AdminSettingsPageUI({
  fetcher,
  initialFields = {},
  onSave,
}) {
  const DEFAULT_FIELDS = useMemo(
    () => ({
      gender: false,
      date_of_birth: false,
      anniversary: false,
      // profile_photo: false,
    }),
    []
  );

  const [fields, setFields] = useState({
    ...DEFAULT_FIELDS,
    ...initialFields,
  });

  // If initialFields comes later from loader, sync state
  useEffect(() => {
    setFields({
      ...DEFAULT_FIELDS,
      ...initialFields,
    });
  }, [DEFAULT_FIELDS, initialFields]);

  const groups = useMemo(
    () => ({
      "Personal Information": ["gender", "date_of_birth", "anniversary"],
      // Profile: ["profile_photo"],
    }),
    []
  );

  const labelize = (key) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const selectedKeys = useMemo(
    () => Object.keys(fields).filter((k) => fields[k]),
    [fields]
  );

  const handleToggle = (key) => {
    setFields((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    if (typeof onSave === "function") {
      // If parent wants to handle save
      return onSave(fields);
    }

    // Default: submit from here
    const selectedFields = Object.keys(fields).filter((key) => fields[key]);
    console.log("🚀 ~ handleSave ~ selectedFields:", selectedFields);
    const existingFields = Object.keys(initialFields).filter(
      (key) => initialFields[key]
    );
    console.log("🚀 ~ handleSave ~ existingFields:", existingFields);

    fetcher.submit(
      {
        selectedFields: JSON.stringify(selectedFields),
        existingFields: JSON.stringify(existingFields),
      },
      { method: "post", action: "/api/updatedata" }
    );
  };

  const isSubmitting = fetcher?.state === "submitting";

  return (
    <div
      className="admin-settings-page"
      style={{
        maxWidth: "720px",
        margin: "0 auto",
        padding: "24px",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
      }}
    >
      <h1 style={{ fontSize: "22px", marginBottom: "6px" }}>
        Customer Profile Settings
      </h1>

      <p style={{ marginTop: 0, color: "#666", fontSize: "14px" }}>
        Select which customer profile fields you want to enable. Removed fields
        will be deleted from Shopify metafield definitions.
      </p>

      {/* Selected Fields Preview */}
      <div
        style={{
          marginTop: "12px",
          padding: "10px 12px",
          borderRadius: "8px",
          background: "#f6f6f7",
          border: "1px solid #e5e7eb",
          fontSize: "14px",
        }}
      >
        <b>Selected Fields:</b>{" "}
        {selectedKeys.length ? selectedKeys.map(labelize).join(", ") : "None"}
      </div>

      <div style={{ marginTop: "18px" }}>
        {Object.entries(groups).map(([groupTitle, keys]) => (
          <section
            key={groupTitle}
            className="settings-section"
            style={{
              marginTop: "16px",
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
              background: "#fff",
            }}
          >
            <h2 style={{ fontSize: "16px", margin: "0 0 10px 0" }}>
              {groupTitle}
            </h2>

            <div className="settings-stack" style={{ display: "grid", gap: 10 }}>
              {keys.map((key) =>
                fields[key] !== undefined ? (
                  <div
                    key={key}
                    className="settings-row"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 10px",
                      borderRadius: "8px",
                      background: "#fafafa",
                      border: "1px solid #eee",
                    }}
                  >
                    <span style={{ fontSize: "14px" }}>{labelize(key)}</span>

                    <label style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="checkbox"
                        checked={!!fields[key]}
                        onChange={() => handleToggle(key)}
                        style={{
                          width: "18px",
                          height: "18px",
                          cursor: "pointer",
                        }}
                      />
                    </label>
                  </div>
                ) : null
              )}
            </div>
          </section>
        ))}
      </div>

      {/* Save Button + Messages */}
      <section style={{ marginTop: "18px" }}>
        <button
          onClick={handleSave}
          disabled={isSubmitting}
          style={{
            padding: "10px 16px",
            backgroundColor: isSubmitting ? "#9ca3af" : "#008060",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          {isSubmitting ? "Saving settings..." : "Save Settings"}
        </button>

        {fetcher?.data?.success && (
          <div
            style={{
              marginTop: "12px",
              padding: "10px 12px",
              backgroundColor: "#d4edda",
              color: "#155724",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          >
            Customer profile settings updated successfully.
          </div>
        )}

        {fetcher?.data?.error && (
          <div
            style={{
              marginTop: "12px",
              padding: "10px 12px",
              backgroundColor: "#f8d7da",
              color: "#721c24",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          >
            {fetcher.data.error}
          </div>
        )}
      </section>
    </div>
  );
}