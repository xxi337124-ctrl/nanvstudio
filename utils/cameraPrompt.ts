import { Camera3DParams } from '../types/camera3d';

/**
 * Build camera angle prompt for AI image generation
 */
export function buildCameraPrompt(
  params: Camera3DParams,
  originalPrompt?: string
): string {
  let prompt = originalPrompt || 'Generate image';

  // Remove trailing period if present
  if (prompt.endsWith('.')) {
    prompt = prompt.slice(0, -1);
  }

  // Horizontal angle
  const h = params.horizontal;
  if (h > 60) {
    prompt += ', viewed from the right side';
  } else if (h < -60) {
    prompt += ', viewed from the left side';
  } else if (h > 20) {
    prompt += ', slight right angle view';
  } else if (h < -20) {
    prompt += ', slight left angle view';
  } else if (Math.abs(h) < 10) {
    prompt += ', front view';
  }

  // Vertical angle
  const v = params.vertical;
  if (v > 30) {
    prompt += ', elevated shot, looking down';
  } else if (v < -30) {
    prompt += ', low angle shot, looking up';
  } else if (Math.abs(v) < 10) {
    prompt += ', eye level';
  }

  // Zoom level
  const z = params.zoom;
  if (z < 2) {
    prompt += ', close-up shot';
  } else if (z > 7) {
    prompt += ', wide shot';
  } else {
    prompt += ', medium shot';
  }

  // Add photography quality keywords
  prompt += ', professional photography, high quality, detailed';

  return prompt;
}

/**
 * Generate a title for the 3D view node
 */
export function build3DViewTitle(params: Camera3DParams): string {
  const h = Math.round(params.horizontal);
  const v = Math.round(params.vertical);
  return `3D视角 (H:${h}° V:${v}°)`;
}

/**
 * Format camera parameters for display
 */
export function formatCameraParams(params: Camera3DParams): string {
  return `H:${params.horizontal.toFixed(1)}° V:${params.vertical.toFixed(1)}° Z:${params.zoom.toFixed(1)}x`;
}
