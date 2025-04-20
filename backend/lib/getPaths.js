// utils/esm-path-utils.js
import { fileURLToPath } from "url";
import { dirname } from "path";

export const getPaths = (metaUrl) => {
  const __filename = fileURLToPath(metaUrl);
  const __dirname = dirname(__filename);
  return { __filename, __dirname };
};
