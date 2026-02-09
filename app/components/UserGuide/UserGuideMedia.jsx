import React from "react";
import { MediaCard } from "@shopify/polaris";

export default function UserGuideMedia() {
  return (
    <MediaCard
      title="Visual Setup Guide"
      description="Watch this quick video to see how to customize the profile appearance."
      primaryAction={{ content: 'Watch Tutorial', onAction: () => {} }}
    >
      <img
        alt="Setup Tutorial"
        width="100%"
        height="100%"
        style={{ objectFit: 'cover' }}
        src="https://burst.shopifyres.com/photos/business-woman-checking-inventory.jpg?width=1850"
      />
    </MediaCard>
  );
}