import React from "react";
import { Page, Layout } from "@shopify/polaris";
import SupportContact from "./SupportContact";
import CustomAppPitch from "./CustomAppPitch";
import ShopifyApps from "./ShopifyApps";
import "./shopifyhelpsupport.css"

export default function HelpSupport() {
  return (
    <Page>
      <Layout>
        <Layout.Section><CustomAppPitch /></Layout.Section>
        <Layout.Section><ShopifyApps /></Layout.Section>
        <Layout.Section><SupportContact /></Layout.Section>
      </Layout>
    </Page>
  );
}
