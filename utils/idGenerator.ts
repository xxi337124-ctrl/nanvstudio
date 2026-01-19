/**
 * Utility functions for generating unique IDs
 */

/**
 * Generate a unique node ID
 * @returns A unique node ID in the format: n-{timestamp}-{random}
 */
export const generateNodeId = (): string => {
  return `n-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

/**
 * Generate a unique group ID
 * @returns A unique group ID in the format: g-{timestamp}-{random}
 */
export const generateGroupId = (): string => {
  return `g-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

/**
 * Generate a unique workflow ID
 * @returns A unique workflow ID in the format: wf-{timestamp}
 */
export const generateWorkflowId = (): string => {
  return `wf-${Date.now()}`;
};

/**
 * Generate a unique asset ID
 * @returns A unique asset ID in the format: a-{timestamp}
 */
export const generateAssetId = (): string => {
  return `a-${Date.now()}`;
};
