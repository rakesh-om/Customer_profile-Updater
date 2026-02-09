import React from "react";
import { BlockStack, Box } from "@shopify/polaris";
import CustomerProfileTopCard from "./infoboxcompany";
import { AdminSettingsPageUI } from "./AdminSettingsPageUI";

export default function Home({ fetcher, initialFields }) {
  return (
    <Box paddingBlockEnd="500">
      <BlockStack gap="500">
        <CustomerProfileTopCard />

        <AdminSettingsPageUI
          fetcher={fetcher}
          initialFields={initialFields}
        />
      </BlockStack>
    </Box>
  );
}
