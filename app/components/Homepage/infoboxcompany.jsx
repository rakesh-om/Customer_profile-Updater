import React, { useState } from "react";
import { Card, Text, BlockStack, InlineStack, Button, Divider } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";

export default function CustomerProfileTopCard() {
  const shopify = useAppBridge();
  const [loading, setLoading] = useState(false);

  const handleRedirect = async () => {
    setLoading(true);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const shop = urlParams.get("shop");

      const response = await fetch(`/api/customerprofile?shop=${shop}`);
      
      if (!response.ok) throw new Error("API not found");

      const data = await response.json();

      if (data.checkoutProfileId) {
        const numericId = data.checkoutProfileId.split("/").pop();
        const cleanShop = shop.replace(".myshopify.com", "");
        
        // Editor URL
        const targetUrl = `https://admin.shopify.com/store/${cleanShop}/settings/checkout/editor/profiles/${numericId}?page=profile`;

        // FIX: Agar shopify.open kaam nahi kar raha, toh window.top.location use karein
        // Ye iframe se bahar nikalne ka sabse foolproof tarika hai
        if (shopify && typeof shopify.open === 'function') {
            shopify.open(targetUrl, "_top");
        } else {
            // Fallback: Agar App Bridge v4 nahi hai
            window.top.location.href = targetUrl;
        }

      } else {
        shopify.toast.show("Please create a checkout profile first", { isError: true });
      }
    } catch (error) {
      console.error("Redirect error:", error);
      // Fallback toast agar shopify object available hai
      if (shopify && shopify.toast) {
        shopify.toast.show("Connection error", { isError: true });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card roundedAbove="sm">
      <BlockStack gap="400">
        <InlineStack align="space-between" blockAlign="center">
          <Text variant="headingMd" as="h2">Customer Profile Editor</Text>
          <Button 
            variant="primary" 
            onClick={handleRedirect} 
            loading={loading}
          >
            Go to Editor
          </Button>
        </InlineStack>
        <Divider />
        <Text variant="bodyMd" tone="subdued">
          Clicking this will take you to the Shopify Checkout Editor to customize your Customer Profile blocks.
        </Text>
      </BlockStack>
    </Card>
  );
}