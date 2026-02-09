import React from "react";
import {
  Card,
  Text,
  BlockStack,
  InlineStack,
  Button,
  Divider,
} from "@shopify/polaris";

export default function CustomerProfileTopCard() {
  const handleRedirect = () => {
    window.open("/settings/customer_accounts", "_top");
  };

  return (
    <Card roundedAbove="sm">
      <BlockStack gap="400">
        {/* Top Row */}
        <InlineStack align="space-between" blockAlign="center">
          <Text variant="headingMd">
            Customer Profile (Account Page)
          </Text>

          <Button
            variant="primary"
            onClick={handleRedirect}
          >
            Enable Customer Account
          </Button>
        </InlineStack>

        <Divider />

        {/* Description */}
        <Text variant="bodyMd" tone="subdued">
          Allow customers to view and update their profile details directly
          from the customer account page. Make sure customer accounts are enabled
          in your Shopify settings.
        </Text>
      </BlockStack>
    </Card>
  );
}
