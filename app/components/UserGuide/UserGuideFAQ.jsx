import React from "react";
import { Text, BlockStack, Box, Divider, Badge } from "@shopify/polaris";

export default function UserGuideFAQ() {
  return (
    <BlockStack gap="500">

      <Box>
        <Text variant="headingSm" as="h3">
          What data does this app collect?
        </Text>
        <Text tone="subdued">
          The app allows customers to manage profile details such as
          Gender, Date of Birth, and Anniversary directly from their
          account page.
        </Text>
      </Box>

      <Divider />

      <Box>
        <Text variant="headingSm" as="h3">
          Where is this data stored?
        </Text>
        <Text tone="subdued">
          All data is stored securely using Shopify Customer Metafields.
          This means the data is native to Shopify and works seamlessly
          with built-in features like Customer Segments and Shopify Flow.
        </Text>
      </Box>

      <Divider />

      <Box>
        <Text variant="headingSm" as="h3">
          How can I view or filter this data?
        </Text>
        <Text tone="subdued">
          Merchants can create dynamic customer segments using the profile
          fields created by this app. For example:
        </Text>

        <Box padding="300" background="bg-surface-secondary" borderRadius="200">
          <Text as="pre" variant="bodySm">
{`SHOW customer_name, email_subscription_status, orders, amount_spent
WHERE metafields.custom_profile.gender = 'male'
OR metafields.custom_profile.anniversary = today
OR metafields.custom_profile.date_of_birth = today`}
          </Text>
        </Box>

        <Text tone="subdued">
          <Badge tone="info">Note:</Badge>{" "}
          Combine multiple filters to create highly targeted customer groups.
        </Text>
      </Box>

      <Divider />

      <Box>
        <Text variant="headingSm" as="h3">
          What can I do with these segments?
        </Text>
        <Text tone="subdued">
          • Run birthday or anniversary campaigns<br />
          • Personalize email & SMS marketing<br />
          • Create loyalty or VIP segments<br />
          • Trigger automations using Shopify Flow
        </Text>
      </Box>


      
    </BlockStack>
  );
}
