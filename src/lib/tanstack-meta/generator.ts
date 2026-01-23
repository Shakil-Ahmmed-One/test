import { createMetadataGenerator } from "tanstack-meta";

export const generateMetadata = createMetadataGenerator({
  titleTemplate: {
    default: "Grahok Landing",
    template: "%s | Grahok Landing",
  },
});
