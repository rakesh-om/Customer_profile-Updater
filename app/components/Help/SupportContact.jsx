import React from "react";
import { Card, BlockStack, InlineGrid, Text, Button, Box } from "@shopify/polaris";
import { EmailIcon, ExternalIcon } from "@shopify/polaris-icons";

export default function SupportContact() {
  return (
    <Card padding="600">
      <BlockStack gap="500">
        <InlineGrid
          columns={{ xs: "1", md: "1fr 2fr" }} // Better responsive handling
          gap="500"
          align="center"
        >
          {/* Logo */}
          <Box
            padding="200"
            background="bg-surface-secondary"
            borderRadius="200"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%", 
              minHeight: "100px" // Added for consistency
            }}
          >
            <img
              src="/OMLogo.svg" 
              alt="OrangeMantra"
              style={{
                maxWidth: "140px",
                width: "100%",
                display: "block",
              }}
            />
          </Box>

          <BlockStack gap="300">
            <Text variant="headingLg" as="h2">
              Need Help or Support?
            </Text>

            <Text tone="subdued">
              This app is developed and maintained by <strong>OrangeMantra</strong>.  
              Our Shopify experts are available to assist you with setup, configuration, 
              and any technical questions related to this app.
            </Text>

            <InlineGrid columns={2} gap="400">
              <Button
                icon={EmailIcon}
                url="mailto:contact@orangemantra.com"
                external
              >
                Contact Support
              </Button>

              <Button
                variant="primary"
                icon={ExternalIcon}
                url="https://www.orangemantra.com/get-a-quote/"
                target="_blank"
                external 
              >
                Request Custom Development
              </Button>
            </InlineGrid>
          </BlockStack>
        </InlineGrid>
      </BlockStack>
    </Card>
  );
}