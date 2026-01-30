import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const { selectedFields, existingFields } = await request.json();

  // Determine fields to create and delete
  const fieldsToCreate = selectedFields.filter((field) => !existingFields.includes(field));
  const fieldsToDelete = existingFields.filter((field) => !selectedFields.includes(field));

  // Create new metafields
  if (fieldsToCreate.length > 0) {
    await admin.graphql(
      `#graphql
      mutation MetafieldsCreate($metafields: [MetafieldInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            key
            namespace
            ownerId
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables: {
          metafields: fieldsToCreate.map((field) => ({
            ownerId: "gid://shopify/Product/20995642", // Replace with dynamic ownerId
            namespace: "inventory",
            key: field,
            value: "true", // Default value for the metafield
            valueType: "STRING",
          })),
        },
      }
    );
  }

  // Delete unselected metafields
  if (fieldsToDelete.length > 0) {
    await admin.graphql(
      `#graphql
      mutation MetafieldsDelete($metafields: [MetafieldIdentifierInput!]!) {
        metafieldsDelete(metafields: $metafields) {
          deletedMetafields {
            key
            namespace
            ownerId
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables: {
          metafields: fieldsToDelete.map((field) => ({
            ownerId: "gid://shopify/Product/20995642", // Replace with dynamic ownerId
            namespace: "inventory",
            key: field,
          })),
        },
      }
    );
  }

  return { success: true };
};