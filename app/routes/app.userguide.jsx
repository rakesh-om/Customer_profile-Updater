import React from "react";
import { Page, Layout, BlockStack } from "@shopify/polaris";

// GALAT: import { UserGuideMain } from "../components/UserGuide/UserGuide";
// SAHI:
import UserGuideMain from "../components/UserGuide/UserGuide"; 

export default function UserGuidePage() {
  return (
    <Page 
      title="User Guide" 
      subtitle="Learn how to configure and use the Customer Profile App"
      // backAction={{ content: "Dashboard", url: "/app" }}
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
             <UserGuideMain />
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}