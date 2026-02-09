import { useLoaderData, useFetcher } from "react-router";
import { Page, Layout } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import Home from "../components/Homepage/Home";

const SETTINGS_NAMESPACE = "selleasy_app_settings";
const SETTINGS_KEY = "customer_profile_fields";

const DEFAULT_FIELDS = {
  gender: false,
  date_of_birth: false,
  anniversary: false,
};

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const settingsQuery = await admin.graphql(`
    query {
      shop {
        metafield(namespace: "${SETTINGS_NAMESPACE}", key: "${SETTINGS_KEY}") {
          value
        }
      }
    }
  `);

  const json = await settingsQuery.json();
  const rawValue = json?.data?.shop?.metafield?.value || "[]";

  let parsed = [];
  try {
    parsed = JSON.parse(rawValue);
  } catch {}

  const initialFields = { ...DEFAULT_FIELDS };
  parsed.forEach((key) => {
    if (key in initialFields) initialFields[key] = true;
  });

  return Response.json({ initialFields });
};

export default function AdminSettingsPage() {
  const fetcher = useFetcher();
  const { initialFields } = useLoaderData();

  return (
    <Page title="Customer Profile">
      <Layout>
        <Layout.Section>
          <Home fetcher={fetcher} initialFields={initialFields} />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
