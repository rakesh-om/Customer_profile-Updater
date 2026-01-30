import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

const CUSTOMER_NAMESPACE = "custom_profile";

export const loader = async ({ request }) => {
  console.log("✅ /api/profile/fields (customer) loader called");

  try {
    // ✅ IMPORTANT: Customer Account UI ke liye ye auth use karo
    const { admin, session } = await authenticate.public.customerAccount(request);

    console.log("🏪 Shop:", session?.shop);
    console.log("🧾 Namespace:", CUSTOMER_NAMESPACE);

    const query = `
      query GetCustomerMetafieldDefinitions {
        metafieldDefinitions(first: 50, ownerType: CUSTOMER, namespace: "${CUSTOMER_NAMESPACE}") {
          edges {
            node {
              key
              name
              namespace
              type {
                name
              }
            }
          }
        }
      }
    `;

    const response = await admin.graphql(query);
    const data = await response.json();

    if (data.errors?.length) {
      throw new Error(data.errors[0]?.message || "GraphQL error");
    }

    const edges = data?.data?.metafieldDefinitions?.edges || [];

    const fields = edges.map((e) => ({
      key: e.node.key,
      label: e.node.name || e.node.key,
      type: e.node.type?.name || "single_line_text_field",
      namespace: e.node.namespace,
    }));

    return json({ ok: true, fields });
  } catch (err) {
    console.error("❌ ERROR /api/profile/fields:", err);
    return json(
      { ok: false, message: err?.message || "Failed to fetch fields" },
      { status: 500 }
    );
  }
};
