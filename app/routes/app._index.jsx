import { useLoaderData, useFetcher } from "react-router";
import { authenticate } from "../shopify.server";
import { AdminSettingsPageUI } from "../components/AdminSettingsPageUI";

const SETTINGS_NAMESPACE = "selleasy_app_settings";
const SETTINGS_KEY = "customer_profile_fields";

const DEFAULT_FIELDS = {
  gender: false,
  date_of_birth: false,
  anniversary: false,
};

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  // You can still fetch currentAppInstallation if needed for other reasons
  const appQuery = await admin.graphql(`
    query {
      currentAppInstallation {
        id
      }
    }
  `);

  const appJson = await appQuery.json();
  const appInstallationId = appJson?.data?.currentAppInstallation?.id;
  console.log("🆔 loader AppInstallationId:", appInstallationId);

  // Load settings from SHOP metafield
  const settingsQuery = await admin.graphql(`
    query GetSettingsForLoader {
      shop {
        metafield(namespace: "${SETTINGS_NAMESPACE}", key: "${SETTINGS_KEY}") {
          value
        }
      }
    }
  `);

  const settingsJson = await settingsQuery.json();
  const rawValue = settingsJson?.data?.shop?.metafield?.value || "[]";

  let parsedArray;
  try {
    parsedArray = JSON.parse(rawValue); // should be an array of keys
  } catch (e) {
    parsedArray = [];
  }

  if (!Array.isArray(parsedArray)) {
    parsedArray = [];
  }

  const initialFields = { ...DEFAULT_FIELDS };
  parsedArray.forEach((key) => {
    if (key in initialFields) {
      initialFields[key] = true;
    }
  });

  return new Response(JSON.stringify({ initialFields }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export default function AdminSettingsPage() {
  const fetcher = useFetcher();
  const { initialFields } = useLoaderData();

  return (
    <AdminSettingsPageUI
      fetcher={fetcher}
      initialFields={initialFields}
      onSave={(fields) => {
        const selectedFields = Object.keys(fields).filter((k) => fields[k]);

        fetcher.submit(
          { selectedFields: JSON.stringify(selectedFields) },
          { method: "post", action: "/api/updatedata" }
        );
      }}
    />
  );
}