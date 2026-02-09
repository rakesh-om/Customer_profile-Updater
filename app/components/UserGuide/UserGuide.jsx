import React from "react";
import { BlockStack, Card, Text, List, Divider, Badge } from "@shopify/polaris";
import UserGuideFAQ from "./UserGuideFAQ.jsx"; 
import UserGuideMedia from "./UserGuideMedia.jsx";

export default function UserGuideMain() {
  return (
    <BlockStack gap="600">

      {/* Intro */}
      <Card>
        <BlockStack gap="200">
          <Badge tone="success">Getting Started</Badge>
          <Text variant="headingMd" as="h2">
            How this app works
          </Text>
          <Text tone="subdued">
            This app helps you collect meaningful customer profile data and
            use it across Shopify for segmentation, personalization, and
            marketing — without leaving your store.
          </Text>
        </BlockStack>
      </Card>

      {/* Visual Guide */}
      <UserGuideMedia />

      {/* Step-by-step Setup */}
      <Card>
        <BlockStack gap="300">
          <Text variant="headingMd" as="h2">
            Step-by-step setup
          </Text>

          <List type="number">
            <List.Item>
              Go to <b>App Settings</b> and enable the profile fields you want
              (Gender, Date of Birth, Anniversary).
            </List.Item>

            <List.Item>
              The app automatically syncs these fields with Shopify Customer
              Metafields — no manual setup required.
            </List.Item>

            <List.Item>
              Customers can now view and update their details from the
              <b> Customer Account → Profile page</b>.
            </List.Item>

            <List.Item>
              Use this data inside <b>Customer Segments</b>, Shopify Flow,
              email marketing, and analytics.
            </List.Item>
          </List>
        </BlockStack>
      </Card>

      {/* FAQ + Education */}
      <Card>
        <BlockStack gap="300">
          <Text variant="headingMd" as="h2">
            Using customer data effectively
          </Text>
          <Divider />
          <UserGuideFAQ />
        </BlockStack>
      </Card>

    </BlockStack>
  );
}
