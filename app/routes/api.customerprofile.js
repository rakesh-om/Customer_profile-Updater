import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  // Merchant authenticate karo
  const { admin } = await authenticate.admin(request);

  try {
    const response = await admin.graphql(
      `#graphql
      query getPublishedProfile {
        checkoutProfiles(first: 1, query: "is_published:true") {
          nodes { id }
        }
      }`
    );

    const responseJson = await response.json();
    const profileId = responseJson.data?.checkoutProfiles?.nodes?.[0]?.id || null;

    return json({ checkoutProfileId: profileId });
  } catch (error) {
    return json({ error: "Failed to fetch profile" }, { status: 500 });
  }
};