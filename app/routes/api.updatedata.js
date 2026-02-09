import { authenticate } from "../shopify.server";

const SETTINGS_NAMESPACE = "selleasy_app_settings";
const CUSTOMER_NAMESPACE = "selleasy_custom_profile"; 
const ALLOWED_FIELDS = ["gender", "date_of_birth", "anniversary"];


function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch (e) {
    return fallback;
  }
}

function fieldType(key) {
  if (key === "date_of_birth" || key === "anniversary") return "date";
  return "single_line_text_field";
}

function labelize(key) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export const action = async ({ request }) => {
  console.log("\n==================== /api/updatedata START ====================\n");

  try {
    const { admin } = await authenticate.admin(request);
    console.log("Authenticated Admin Request");

    // 1) Get App Installation ID (still useful if needed later)
    const appQuery = await admin.graphql(`
      query {
        currentAppInstallation {
          id
        }
      }
    `);
    const appJson = await appQuery.json();
    const appInstallationId = appJson?.data?.currentAppInstallation?.id;
    console.log("🆔 AppInstallationId:", appInstallationId);

    if (!appInstallationId) {
      console.log("❌ App installation ID not found");
      return new Response(
        JSON.stringify({ success: false, error: "App installation ID not found" }),
        { status: 400 }
      );
    }

    // 1b) Get Shop ID (for settings metafield owner)
    const shopQuery = await admin.graphql(`
      query {
        shop {
          id
        }
      }
    `);
    const shopJson = await shopQuery.json();
    const shopId = shopJson?.data?.shop?.id;
    console.log("🆔 ShopId:", shopId);

    if (!shopId) {
      console.log("❌ Shop ID not found");
      return new Response(
        JSON.stringify({ success: false, error: "Shop ID not found" }),
        { status: 400 }
      );
    }

    // 2) Read selectedFields from request
    const contentType = request.headers.get("content-type") || "";
    let selectedFields = [];
    if (contentType.includes("application/json")) {
      const body = await request.json();
      selectedFields = body?.selectedFields || body?.fields || [];
    } else {
      const formData = await request.formData();
      const raw = formData.get("selectedFields");
      selectedFields = raw ? safeJsonParse(raw, []) : [];
    }

    if (!Array.isArray(selectedFields)) selectedFields = [];
    selectedFields = selectedFields.filter((k) => ALLOWED_FIELDS.includes(k));
    console.log("🟢 selectedFields (after filter):", selectedFields);

    // 3) Fetch existing saved selection from SHOP metafield
    const existingQuery = await admin.graphql(`
      query GetSettingsForUpdatedata {
        shop {
          metafield(namespace: "${SETTINGS_NAMESPACE}", key: "customer_profile_fields") {
            id
            value
          }
        }
      }
    `);

    const existingJson = await existingQuery.json();
    const existingValue = existingJson?.data?.shop?.metafield?.value || "[]";
    let existingFields = safeJsonParse(existingValue, []);
    if (!Array.isArray(existingFields)) existingFields = [];
    existingFields = existingFields.filter((k) => ALLOWED_FIELDS.includes(k));
    console.log("🟡 existingFields (from metafield):", existingFields);

    // 4) Delta
    const toCreate = selectedFields.filter((k) => !existingFields.includes(k));
    const toDisable = existingFields.filter((k) => !selectedFields.includes(k));
    console.log("✨ toCreate:", toCreate);
    console.log("🚫 toDisable (NO DELETE):", toDisable);

    // 5) Create missing metafield definitions for CUSTOMER
    for (const key of toCreate) {
      console.log(`\n🔍 Ensuring metafield definition exists for: ${key}`);
      const defQuery = await admin.graphql(`
        query {
          metafieldDefinitions(first: 1, ownerType: CUSTOMER, namespace: "${CUSTOMER_NAMESPACE}", key: "${key}") {
            edges { node { id } }
          }
        }
      `);

      const defJson = await defQuery.json();
      const existingDefId = defJson?.data?.metafieldDefinitions?.edges?.[0]?.node?.id;
      console.log("📦 Existing definition id:", existingDefId);

      if (existingDefId) {
        console.log(`✅ Definition already exists for ${key}, skip create`);
        continue;
      }

      console.log(`✨ Creating definition for ${key}`);
      const createRes = await admin.graphql(`
        mutation CreateDef($definition: MetafieldDefinitionInput!) {
          metafieldDefinitionCreate(definition: $definition) {
            createdDefinition { id namespace key }
            userErrors { message }
          }
        }
      `, {
        variables: {
          definition: {
            name: labelize(key),
            namespace: CUSTOMER_NAMESPACE,
            key,
            ownerType: "CUSTOMER",
            type: fieldType(key),
            access: { customerAccount: "READ_WRITE", storefront: "PUBLIC_READ" },
          }
        }
      });

      const createJson = await createRes.json();
      console.log("📦 Create Result:", JSON.stringify(createJson, null, 2));

      const errors = createJson?.data?.metafieldDefinitionCreate?.userErrors || [];
      if (errors.length) {
        console.log(`❌ Create errors for ${key}:`, errors);
      } else {
        console.log(`✅ Created definition for ${key}`);
      }
    }

    // 6) Save updated selected fields in SHOP metafield
    const savePayload = [{
      ownerId: shopId, // ✅ Save on Shop
      namespace: SETTINGS_NAMESPACE,
      key: "customer_profile_fields",
      type: "json",
      value: JSON.stringify(selectedFields),
    }];

    console.log("💾 Saving Shop metafield:", JSON.stringify(savePayload, null, 2));
    const saveSettingsRes = await admin.graphql(`
      mutation SaveSettings($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields { id key namespace value }
          userErrors { message }
        }
      }
    `, { variables: { metafields: savePayload }});

    const saveJson = await saveSettingsRes.json();
    console.log("📦 Save Settings Response:", JSON.stringify(saveJson, null, 2));

    const saveErrors = saveJson?.data?.metafieldsSet?.userErrors || [];
    if (saveErrors.length) {
      console.log("❌ Save Settings Errors:", saveErrors);
      return new Response(
        JSON.stringify({ success: false, error: saveErrors.map(e => e.message).join(", ") }),
        { status: 400 }
      );
    }

    console.log("\n==================== /api/updatedata SUCCESS ====================\n");
    return new Response(
      JSON.stringify({ success: true, selectedFields, existingFields, toCreate, toDisable }),
      { status: 200 }
    );

  } catch (err) {
    console.log("\n==================== /api/updatedata FAILED ====================\n");
    console.error("🔥 ERROR /api/updatedata:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
};