import React, { useState } from "react";
import { Card, Text, BlockStack, InlineStack, Button, Badge } from "@shopify/polaris";

export default function AppDetailsEnableCard() {
  const [enabled, setEnabled] = useState(false);

  const handleToggle = () => {
    setEnabled((prev) => !prev);
  };

  return (
    <Card roundedAbove="sm">
      <BlockStack gap="300">
        {/* Header */}
        <InlineStack align="space-between" blockAlign="center">
          <BlockStack gap="100">
            <Text as="h2" variant="headingMd">
              Selleasy Upsell & Cross-sell
            </Text>
            <InlineStack gap="200" blockAlign="center">
              <Badge tone={enabled ? "success" : "critical"}>
                {enabled ? "Enabled" : "Disabled"}
              </Badge>
              <Text as="p" variant="bodySm" tone="subdued">
                Version: 1.0.0
              </Text>
            </InlineStack>
          </BlockStack>

          <Button
            variant={enabled ? "secondary" : "primary"}
            tone={enabled ? "critical" : "success"}
            onClick={handleToggle}
          >
            {enabled ? "Disable App" : "Enable App"}
          </Button>
        </InlineStack>

        {/* Description */}
        <Text as="p" variant="bodyMd" tone="subdued">
          Boost your sales by showing smart upsell and cross-sell offers on product,
          cart and checkout pages.
        </Text>

        {/* Extra Info */}
        <InlineStack gap="400">
          <Text as="p" variant="bodySm" tone="subdued">
            Merchant: Demo Store
          </Text>
          <Text as="p" variant="bodySm" tone="subdued">
            Plan: Free
          </Text>
        </InlineStack>
      </BlockStack>
    </Card>
  );
}
