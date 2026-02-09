import React from "react";
import { Banner, Text, Box, Link } from "@shopify/polaris";

export default function CustomAppPitch() {
  return (
    <Banner tone="info" title="Looking for a Custom Shopify App?">
      <Text>
        If you need a custom Shopify app, private app, or advanced
        functionality tailored to your business, <strong>OrangeMantra</strong> specializes in building scalable
        Shopify and Shopify Plus solutions.
      </Text>

      <Box marginBlockStart="200">
        <Link url="https://www.orangemantra.com/get-a-quote/" external>
          Talk to our Shopify experts →
        </Link>
      </Box>
    </Banner>
  );
}
