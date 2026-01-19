/**
 * 3D Camera Angle Parameters
 */
export interface Camera3DParams {
  horizontal: number; // -180 to 180 degrees
  vertical: number; // -90 to 90 degrees
  zoom: number; // 0.1 to 10

  // Preset options
  horizontalPreset?: HorizontalPreset;
  verticalPreset?: VerticalPreset;
  zoomPreset?: ZoomPreset;
}

export type HorizontalPreset = 'front' | 'right' | 'left' | 'back';
export type VerticalPreset = 'eye_level' | 'elevated' | 'low_angle';
export type ZoomPreset = 'close_up' | 'medium' | 'wide';

/**
 * Default camera parameters
 */
export const DEFAULT_CAMERA_PARAMS: Camera3DParams = {
  horizontal: 0,
  vertical: 0,
  zoom: 5,
};

/**
 * Horizontal preset values
 */
export const HORIZONTAL_PRESETS: Record<
  HorizontalPreset,
  { value: number; label: string }
> = {
  front: { value: 0, label: '正面视图' },
  right: { value: 90, label: '右侧视图' },
  left: { value: -90, label: '左侧视图' },
  back: { value: 180, label: '背面视图' },
};

/**
 * Vertical preset values
 */
export const VERTICAL_PRESETS: Record<
  VerticalPreset,
  { value: number; label: string }
> = {
  eye_level: { value: 0, label: '平视' },
  elevated: { value: 45, label: '俯视' },
  low_angle: { value: -45, label: '仰视' },
};

/**
 * Zoom preset values
 */
export const ZOOM_PRESETS: Record<
  ZoomPreset,
  { value: number; label: string }
> = {
  close_up: { value: 1.5, label: '特写' },
  medium: { value: 5, label: '中景' },
  wide: { value: 8, label: '远景' },
};
