import { useEffect, useMemo, useState } from "react";
import {
  Card,
  BlockStack,
  Text,
  Checkbox,
  Button,
  Banner,
  Box,
  InlineStack,
  Divider,
} from "@shopify/polaris";

export function AdminSettingsPageUI({ fetcher, initialFields = {} }) {
  const DEFAULT_FIELDS = useMemo(
    () => ({
      gender: false,
      date_of_birth: false,
      anniversary: false,
    }),
    []
  );

  const [fields, setFields] = useState({
    ...DEFAULT_FIELDS,
    ...initialFields,
  });

  useEffect(() => {
    setFields({
      ...DEFAULT_FIELDS,
      ...initialFields,
    });
  }, [DEFAULT_FIELDS, initialFields]);

  const groups = useMemo(
    () => ({
      "Personal Information": ["gender", "date_of_birth", "anniversary"],
    }),
    []
  );

  const labelize = (key) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const selectedKeys = useMemo(
    () => Object.keys(fields).filter((k) => fields[k]),
    [fields]
  );

  const handleToggle = (key, checked) => {
    setFields((prev) => ({
      ...prev,
      [key]: checked,
    }));
  };

  const handleSave = () => {
    const selectedFields = Object.keys(fields).filter((k) => fields[k]);

    console.log("✅ Submitting fields:", selectedFields);

    fetcher.submit(
      { selectedFields: JSON.stringify(selectedFields) },
      { method: "post", action: "/api/updatedata" }
    );
  };

  const isSubmitting = fetcher?.state === "submitting";

  return (
    <BlockStack gap="400">
      {fetcher?.data?.success && (
        <Banner tone="success" title="Success">
          <p>Customer profile settings updated successfully.</p>
        </Banner>
      )}

      {fetcher?.data?.error && (
        <Banner tone="critical" title="Error">
          <p>{fetcher.data.error}</p>
        </Banner>
      )}

      <Card>
        <BlockStack gap="500">
          <BlockStack gap="200">
            <Text as="h2" variant="headingMd">
              Customer Profile Settings
            </Text>
            <Text as="p" tone="subdued">
              Select which customer profile fields you want to enable.
            </Text>
          </BlockStack>

          <Box background="bg-surface-secondary" padding="300" borderRadius="200">
            <Text variant="bodySm">
              <Text as="span" fontWeight="bold">
                Selected Fields:{" "}
              </Text>
              {selectedKeys.length
                ? selectedKeys.map(labelize).join(", ")
                : "None"}
            </Text>
          </Box>

          <Divider />

          {Object.entries(groups).map(([groupTitle, keys]) => (
            <BlockStack key={groupTitle} gap="400">
              <Text variant="headingSm">{groupTitle}</Text>
              <BlockStack gap="200">
                {keys.map((key) => (
                  <Checkbox
                    key={key}
                    label={labelize(key)}
                    checked={!!fields[key]}
                    onChange={(checked) => handleToggle(key, checked)}
                  />
                ))}
              </BlockStack>
            </BlockStack>
          ))}

          <Divider />

          <InlineStack align="end">
            <Button
              variant="primary"
              onClick={handleSave}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Save Settings
            </Button>
          </InlineStack>
        </BlockStack>
      </Card>
    </BlockStack>
  );
}
