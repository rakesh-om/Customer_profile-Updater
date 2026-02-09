import React from "react";
import { BlockStack, Card, Text, List, Divider } from "@shopify/polaris";

// 1. Extension (.jsx) zaroor lagao
// 2. ./ use karo current folder ke liye
import UserGuideFAQ from "./UserGuideFAQ.jsx"; 
import UserGuideMedia from "./UserGuideMedia.jsx";

export default function UserGuideMain() {
  return (
    <BlockStack gap="500">
      {/* Component rendering */}
      <UserGuideMedia />

      <Card>
        <BlockStack gap="300">
          <Text variant="headingMd" as="h2">Quick Installation Steps</Text>
          <List type="number">
            <List.Item>Toggle the fields you want in <b>Settings</b>.</List.Item>
            <List.Item>Sync with Shopify Metafields.</List.Item>
            <List.Item>Check the Customer Account page on your store.</List.Item>
          </List>
        </BlockStack>
      </Card>

      <Card>
        <BlockStack gap="300">
          <Text variant="headingMd" as="h2">Common Questions</Text>
          <Divider />
          <UserGuideFAQ />
        </BlockStack>
      </Card>
    </BlockStack>
  );
}