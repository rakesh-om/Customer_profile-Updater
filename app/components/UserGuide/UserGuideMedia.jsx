  import React from "react";
  import { MediaCard } from "@shopify/polaris";

  const IMAGE_URL =
    "https://cdn.shopify.com/s/files/1/0730/4580/3239/files/Screenshot_from_2026-02-09_12-10-56.png?v=1770619273";

  export default function UserGuideMedia() {
    const handleView = () => {
      window.open(IMAGE_URL, "_blank", "noopener,noreferrer");
    };

    return (
      <MediaCard
        title="See it in action"
        description="Learn how customers Get their data and how you can use that data inside Shopify."
        primaryAction={{ content: "View setup guide", onAction: handleView }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#f6f6f7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          onClick={handleView}
          title="Click to view full image"
        >
          <img
            alt="Customer profile and segments overview"
            src={IMAGE_URL}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              borderRadius: "8px",
            }}
          />
        </div>
      </MediaCard>
    );
  }
