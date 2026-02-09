import React from "react";
import { Card, BlockStack, InlineGrid, Text, Box, Link, Divider } from "@shopify/polaris";

export default function ShopifyApps() {
  const apps = [
    {
      title: "Product Q&A Management",
      image: "/productqa.webp",
      description: "Allow customers to ask questions directly on product pages and respond with clear, organized answers to improve trust and conversions.",
      url: "https://apps.shopify.com/product-q-a-management",
    },
    {
      title: "Wishlist & Save for Later",
      image: "/wishlist2.webp",
      description: "Let customers save products to their wishlist and return later to complete their purchase, increasing repeat visits and sales.",
      url: "https://apps.shopify.com/wishlist-app-live",
    },
  ];

  return (
    <Card padding="600">
      <BlockStack gap="500">
        <Text variant="headingMd" as="h3">Our Shopify Apps</Text>
        <Divider />

        <InlineGrid columns={2} gap="600">
          {apps.map((app) => (
            <Card key={app.title} padding="400">
              <InlineGrid columns={["small", "fill"]} gap="400" align="center">
                <Box>
                  <img
                    src={app.image}
                    alt={app.title}
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </Box>
                <BlockStack gap="100">
                  <Text variant="bodyLg" fontWeight="bold">{app.title}</Text>
                  <Text tone="subdued">{app.description}</Text>
                  <Link url={app.url} external>
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
