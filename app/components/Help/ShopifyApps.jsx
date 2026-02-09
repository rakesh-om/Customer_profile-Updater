import React from "react";
import { Card, BlockStack, InlineGrid, Text, Box, Link, Divider } from "@shopify/polaris";
import "./shopifyhelpsupport.css";


export default function ShopifyApps() {
  const apps = [
    {
      title: "Product Q&A Management",
      image: "/productqa.webp",
      description:
        "Allow customers to ask questions directly on product pages and respond with clear, organized answers to improve trust and conversions.",
      url: "https://apps.shopify.com/product-q-a-management",
    },
    {
      title: "Wishlist & Save for Later",
      image: "/wishlist2.webp",
      description:
        "Let customers save products to their wishlist and return later to complete their purchase, increasing repeat visits and sales.",
      url: "https://apps.shopify.com/wishlist-app-live",
    },
  ];

  return (
    <Card padding="600" className="shopify-apps-card">
      <BlockStack gap="500" className="shopify-apps-stack">
        <Text variant="headingMd" as="h3" className="shopify-apps-heading">
          Our Shopify Apps
        </Text>
    
        <InlineGrid columns={2} gap="600" display="flex" className="shopify-apps-grid">
          {apps.map((app) => (
            <Card key={app.title} padding="400" className="shopify-app-card">
              <InlineGrid columns={["small", "fill"]} gap="400" align="center" className="shopify-app-inline">
                <Box className="shopify-app-image-box">
                  <img src={app.image} alt={app.title} className="shopify-app-image" />
                </Box>
                <BlockStack gap="100" className="shopify-app-info">
                  <Text variant="bodyLg" fontWeight="bold" className="shopify-app-title">
                    {app.title}
                  </Text>
                  <Text tone="subdued" className="shopify-app-description">
                    {app.description}
                  </Text>
                  <Link url={app.url} external className="shopify-app-link">
                    View on Shopify App Store →
                  </Link>
                </BlockStack>
              </InlineGrid>
            </Card>
          ))}
        </InlineGrid>
      </BlockStack>
    </Card>
  );
}
