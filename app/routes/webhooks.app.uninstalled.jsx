import { authenticate } from "../shopify.server";
import db from "../db.server";

const CUSTOMER_NAMESPACE = "selleasy_custom_profile";
const SETTINGS_NAMESPACE = "selleasy_app_settings";
const SETTINGS_KEY = "customer_profile_fields";
const ALLOWED_FIELDS = ["gender", "date_of_birth", "anniversary"];

export const action = async ({ request }) => {
  const { shop, session, admin, topic } = await authenticate.webhook(request);

  console.log(`🔥 Received ${topic} webhook for ${shop}`);

  try {
    /* ===============================
       1️⃣ DELETE SERVER SIDE DATA
       =============================== */

    // Delete sessions (per-shop)
    if (session) {
      await db.session.deleteMany({ where: { shop } });
      console.log("🧹 Sessions deleted for shop:", shop);
    }

    /* ===============================
       2️⃣ DELETE CUSTOMER METAFIELD DEFINITIONS
       (MASTER CLEANUP)
       =============================== */

    for (const key of ALLOWED_FIELDS) {
      try {
        const defQuery = await admin.graphql(
          `query GetDef($namespace: String!, $key: String!) {
            metafieldDefinitions(
              first: 1
              ownerType: CUSTOMER
              namespace: $namespace
              key: $key
            ) {
              edges {
                node { id }
              }
            }
          }`,
          {
            variables: {
              namespace: CUSTOMER_NAMESPACE,
              key,
            },
          }
        );

        const defJson = await defQuery.json();
        const defId =
          defJson?.data?.metafieldDefinitions?.edges?.[0]?.node?.id;

        if (!defId) {
          console.log(`ℹ️ No definition found for ${key}, skipping`);
          continue;
        }

        const deleteRes = await admin.graphql(
          `mutation DeleteDef($id: ID!) {
            metafieldDefinitionDelete(id: $id) {
              deletedDefinitionId
              userErrors { message }
            }
          }`,
          { variables: { id: defId } }
        );

        const deleteJson = await deleteRes.json();
        const errors =
          deleteJson?.data?.metafieldDefinitionDelete?.userErrors || [];

        if (errors.length) {
          console.error(`❌ Failed deleting ${key}:`, errors);
        } else {
          console.log(`✅ Deleted customer metafield definition: ${key}`);
        }
      } catch (err) {
        console.error(`❌ Error deleting definition ${key}:`, err);
      }
    }

    /* ===============================
       3️⃣ DELETE SHOP SETTINGS METAFIELD
       =============================== */

    try {
      const shopQuery = await admin.graphql(
        `query GetShopMetafield($namespace: String!, $key: String!) {
          shop {
            metafield(namespace: $namespace, key: $key) {
              id
            }
          }
        }`,
        {
          variables: {
            namespace: SETTINGS_NAMESPACE,
            key: SETTINGS_KEY,
          },
        }
      );

      const shopJson = await shopQuery.json();
      const metafieldId = shopJson?.data?.shop?.metafield?.id;

      if (!metafieldId) {
        console.log("ℹ️ No shop settings metafield found, skipping");
      } else {
        const deleteShopMf = await admin.graphql(
          `mutation DeleteShopMetafield($id: ID!) {
            metafieldDelete(input: { id: $id }) {
              deletedId
              userErrors { message }
            }
          }`,
          { variables: { id: metafieldId } }
        );

        const deleteJson = await deleteShopMf.json();
        const errors =
          deleteJson?.data?.metafieldDelete?.userErrors || [];

        if (errors.length) {
          console.error("❌ Failed deleting shop settings:", errors);
        } else {
          console.log("✅ Deleted shop settings metafield");
        }
      }
    } catch (err) {
      console.error("❌ Error deleting shop settings metafield:", err);
    }

  

    console.log(`🎉 Full cleanup completed for ${shop}`);
  } catch (err) {
    console.error(`🔥 Uninstall cleanup failed for ${shop}:`, err);
  }

  return new Response("OK");
};
