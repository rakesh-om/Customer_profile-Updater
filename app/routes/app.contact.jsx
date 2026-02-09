import React from "react";
import { Page, Layout, BlockStack } from "@shopify/polaris";

// GALAT: import { UserGuideMain } from "../components/UserGuide/UserGuide";
// SAHI:
import HelpSupport from "../components/Help/HelpSupport"; 

export default function UserGuidePage() {
  return (
  <Page 
  title="Contact"
  titleMetadata={<div style={{ flex: 1, textAlign: 'center' }}> </div>}
>
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
             <HelpSupport />
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}