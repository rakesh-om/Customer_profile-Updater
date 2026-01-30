// createOrUpdateCustomerMetafields.server.js

export async function createOrUpdateCustomerMetafields(
  admin, // Pura admin object pass karo fetch ki jagah
  customerGID,
  fieldsData
) {
  if (!customerGID || !fieldsData) return;

  const metafields = Object.entries(fieldsData).map(([key, value]) => {
    // Type checking logic
    let type = "single_line_text_field";
    if (key.includes("date") || key.includes("anniversary")) {
      type = "date";
    }

    return {
      ownerId: customerGID,
      namespace: "selleasy_customer_data", // Unique namespace for your app
      key,
      type,
      value: String(value),
    };
  });

  const mutation = `
    mutation SetMetafields($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        userErrors { message }
        metafields { id key value }
      }
    }
  `;

  const response = await admin.graphql(mutation, { variables: { metafields } });
  const json = await response.json();
  
  return json.data?.metafieldsSet;
}