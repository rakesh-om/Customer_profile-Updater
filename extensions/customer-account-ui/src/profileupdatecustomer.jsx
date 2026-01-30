// @ts-nocheck
import "@shopify/ui-extensions/preact";
import { render } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";

const API_VERSION = "2026-01";

// // ✅ Merchant settings metafield (Shop resource)
// const SETTINGS_NAMESPACE = "selleasy_app_settings";
// const SETTINGS_KEY = "customer_profile_fields";
// const CUSTOMER_NAMESPACE = "$app:selleasy_custom_profile";



const SETTINGS_NAMESPACE = "$app:selleasy_app_settings";
const SETTINGS_KEY = "customer_profile_fields";

const CUSTOMER_NAMESPACE = "$app:custom_profile";
// All possible fields
const ALL_FIELDS = ["gender", "date_of_birth", "anniversary"];

function labelFromKey(key) {
  return key.replaceAll("_", " ").toUpperCase();
}

function getMetafieldType(key) {
  if (key === "date_of_birth" || key === "anniversary") return "date";
  return "single_line_text_field";
}

function safeParseJSON(value) {
  try {
    return JSON.parse(value);
  } catch (e) {
    return null;
  }
}

function ProfileUpdateCustomer() {
  const [customerId, setCustomerId] = useState(null);
  const [enabledFields, setEnabledFields] = useState(ALL_FIELDS);
  const [fieldValues, setFieldValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const visibleFields = useMemo(() => {
    return enabledFields.filter((f) => ALL_FIELDS.includes(f));
  }, [enabledFields]);

  // 1) Boot: Fetch customer metafields + merchant settings
  useEffect(() => {
    async function boot() {
      setLoading(true);
      setError("");
      setSuccess(false);

      try {
        const query = `
          query BootCustomerProfile {
            customer {
              id
              gender: metafield(namespace: "${CUSTOMER_NAMESPACE}", key: "gender") {
                value
              }
              date_of_birth: metafield(namespace: "${CUSTOMER_NAMESPACE}", key: "date_of_birth") {
                value
              }
              anniversary: metafield(namespace: "${CUSTOMER_NAMESPACE}", key: "anniversary") {
                value
              }
            }

            shop {
              id
              settings: metafield(namespace: "${SETTINGS_NAMESPACE}", key: "${SETTINGS_KEY}") {
                value
              }
            }
          }
        `;

        const res = await fetch(
          `shopify:customer-account/api/${API_VERSION}/graphql.json`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query }),
          }
        );

        const json = await res.json();
        console.log("🚀 Boot JSON =>", json);

        if (json.errors?.length) {
          throw new Error(json.errors[0]?.message || "GraphQL error");
        }

        const data = json.data;
        const customer = data?.customer;
        const shopSettingsRaw = data?.shop?.settings?.value || "[]";

        console.log("🧾 Merchant settings raw =>", shopSettingsRaw);

        if (!customer?.id) throw new Error("Customer not logged in.");
        setCustomerId(customer.id);

        // Customer values
        const initialValues = {};
        ALL_FIELDS.forEach((key) => {
          initialValues[key] = customer?.[key]?.value || "";
        });
        setFieldValues(initialValues);

        // Merchant enabled fields
        const parsed = safeParseJSON(shopSettingsRaw);
        let fieldsFromSettings = null;

        if (Array.isArray(parsed)) {
          fieldsFromSettings = parsed;
        } else if (parsed?.enabled && Array.isArray(parsed.enabled)) {
          fieldsFromSettings = parsed.enabled;
        }

        if (fieldsFromSettings?.length) setEnabledFields(fieldsFromSettings);
        else setEnabledFields(ALL_FIELDS);
      } catch (e) {
        console.error("❌ Boot error =>", e);
        setError(e?.message || String(e));
      } finally {
        setLoading(false);
      }
    }

    boot();
  }, []);

  // 2) Save only visible fields
  async function handleSave() {
    if (!customerId) return;

    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const fieldsToUpdate = visibleFields.filter((key) => key in fieldValues);

      const metafields = fieldsToUpdate.map((key) => ({
        ownerId: customerId,
        namespace: CUSTOMER_NAMESPACE,
        key,
        type: getMetafieldType(key),
        value: fieldValues[key] || "",
      }));

      if (metafields.length === 0) {
        setError("No fields to update.");
        setSaving(false);
        return;
      }

      const mutation = `
        mutation SetCustomerMetafields($metafields: [MetafieldsSetInput!]!) {
          metafieldsSet(metafields: $metafields) {
            metafields {
              key
              namespace
              value
              createdAt
              updatedAt
            }
            userErrors {
              field
              message
              code
            }
          }
        }
      `;

      console.log("📌 Save Metafields Payload =>", metafields);

      const res = await fetch(
        `shopify:customer-account/api/${API_VERSION}/graphql.json`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: mutation,
            variables: { metafields },
          }),
        }
      );

      const json = await res.json();
      console.log("🚀 Save JSON =>", json);

      if (json.errors?.length) {
        throw new Error(json.errors[0]?.message || "GraphQL error");
      }

      const userErrors = json.data?.metafieldsSet?.userErrors || [];
      if (userErrors.length) {
        console.error("❌ MetafieldsSet userErrors =>", userErrors);
        throw new Error(userErrors[0]?.message || "Metafield save error");
      }

      setSuccess(true);
    } catch (e) {
      console.error("❌ Save error =>", e);
      setError(e?.message || String(e));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <s-text>Loading...</s-text>;

  return (
    <s-section heading="Your Profile">
      <s-stack direction="block" gap="base" padding="base">
        <s-stack direction="inline" gap="base" alignment="center">
          <s-text tone="neutral" size="large">
            Your Profile
          </s-text>
        </s-stack>

        {error && <s-text tone="critical">{error}</s-text>}
        {success && (
          <s-text tone="success">✅ Profile updated successfully!</s-text>
        )}

        <s-divider />

        {/* Read-only field list */}
        {visibleFields.map((key) => {
          return (
            <s-stack key={key} direction="inline" gap="base">
              <s-text tone="neutral">{labelFromKey(key)}</s-text>
              <s-text>{fieldValues[key] || "Not set"}</s-text>
            </s-stack>
          );
        })}

        <s-button
          variant="primary"
          commandFor="edit-profile-modal"
          command="--show"
          onClick={() => {
            setError("");
            setSuccess(false);
          }}
        >
          Update Profile
        </s-button>

        {/* Modal */}
        <s-modal id="edit-profile-modal" heading="Edit Profile">
          <s-stack direction="block" gap="base" padding="base">
            {visibleFields.includes("gender") && (
              <s-select
                label="Gender"
                value={fieldValues.gender}
                onChange={(event) =>
                  setFieldValues({
                    ...fieldValues,
                    gender: event?.target?.value || "",
                  })
                }
              >
                <s-option value="">Select</s-option>
                <s-option value="male">Male</s-option>
                <s-option value="female">Female</s-option>
                <s-option value="other">Other</s-option>
              </s-select>
            )}

            {visibleFields.includes("date_of_birth") && (
              <s-date-field
                label="DATE OF BIRTH"
                value={fieldValues.date_of_birth}
                onChange={(event) =>
                  setFieldValues({
                    ...fieldValues,
                    date_of_birth: event?.target?.value || "",
                  })
                }
              />
            )}

            {visibleFields.includes("anniversary") && (
              <s-date-field
                label="ANNIVERSARY"
                value={fieldValues.anniversary}
                onChange={(event) =>
                  setFieldValues({
                    ...fieldValues,
                    anniversary: event?.target?.value || "",
                  })
                }
              />
            )}

            <s-button
              slot="primary-action"
              variant="primary"
              loading={saving}
              commandFor="edit-profile-modal"
              command="--hide"
              onClick={handleSave}
            >
              Save Changes
            </s-button>

            <s-button
              slot="secondary-actions"
              variant="secondary"
              commandFor="edit-profile-modal"
              command="--hide"
            >
              Cancel
            </s-button>
          </s-stack>
        </s-modal>
      </s-stack>
    </s-section>
  );
}

export default function extension() {
  render(<ProfileUpdateCustomer />, document.body);
}
