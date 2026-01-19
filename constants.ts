/**
 * Application Constants
 * Centralized configuration values for easy maintenance
 */

// ============================================
// UI & Layout Constants
// ============================================

export const UI = {
  // Apple-style physics curve for animations
  SPRING: 'cubic-bezier(0.32, 0.72, 0, 1)' as const,

  // Canvas interaction
  SNAP_THRESHOLD: 8, // Pixels for magnetic snap
  COLLISION_PADDING: 24, // Spacing when nodes bounce off each other

  // Viewport limits
  MIN_SCALE: 0.2,
  MAX_SCALE: 3,
  SCALE_STEP: 0.1,

  // Animation durations (ms)
  ANIMATION_FAST: 150,
  ANIMATION_NORMAL: 300,
  ANIMATION_SLOW: 500,

  // Z-index layers
  Z_INDEX: {
    CANVAS: 0,
    CONNECTIONS: 1,
    NODES: 10,
    DRAGGING: 100,
    MODAL: 1000,
    TOOLTIP: 2000,
    ERROR_BOUNDARY: 9999,
  } as const,
} as const;

// ============================================
// Node Constants
// ============================================

export const NODE = {
  DEFAULT_WIDTH: 420,
  DEFAULT_FIXED_HEIGHT: 360,
  AUDIO_NODE_HEIGHT: 200,
  MIN_WIDTH: 300,
  MAX_WIDTH: 800,
  MIN_HEIGHT: 200,
  MAX_HEIGHT: 1200,

  // Header height for calculation
  HEADER_HEIGHT: 48,

  // Port positions
  PORT_SIZE: 12,
  PORT_OFFSET: 8,
} as const;

// ============================================
// Image & Video Constants
// ============================================

export const MEDIA = {
  // Aspect ratios
  IMAGE_ASPECT_RATIOS: ['1:1', '3:4', '4:3', '9:16', '16:9'] as const,
  VIDEO_ASPECT_RATIOS: ['1:1', '3:4', '4:3', '9:16', '16:9'] as const,

  // Resolutions
  IMAGE_RESOLUTIONS: ['1k', '2k', '4k'] as const,
  VIDEO_RESOLUTIONS: ['480p', '720p', '1080p'] as const,

  // Generation counts
  IMAGE_COUNTS: [1, 2, 3, 4] as const,
  VIDEO_COUNTS: [1, 2, 3, 4] as const,

  // Default values
  DEFAULT_ASPECT_RATIO: '16:9',
  DEFAULT_IMAGE_RESOLUTION: '2k',
  DEFAULT_VIDEO_RESOLUTION: '720p',

  // File size limits (bytes)
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_VIDEO_SIZE: 100 * 1024 * 1024, // 100MB

  // Supported formats
  IMAGE_FORMATS: ['image/png', 'image/jpeg', 'image/webp'] as const,
  VIDEO_FORMATS: ['video/mp4', 'video/webm'] as const,
} as const;

// ============================================
// Storage Constants
// ============================================

export const STORAGE = {
  // IndexedDB configuration
  DB_NAME: 'nova_studio_db',
  DB_VERSION: 1,
  STORE_NAME: 'app_data',

  // Storage keys
  KEYS: {
    ASSETS: 'assets',
    WORKFLOWS: 'workflows',
    NODES: 'nodes',
    CONNECTIONS: 'connections',
    GROUPS: 'groups',
    SETTINGS: 'settings',
  } as const,

  // History limits
  MAX_HISTORY_STEPS: 50,
  MAX_ASSET_HISTORY: 100,
} as const;

// ============================================
// API Constants
// ============================================

export const API = {
  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_BASE_DELAY: 2000, // ms
  RETRY_MAX_DELAY: 10000, // ms

  // Timeout configuration
  DEFAULT_TIMEOUT: 30000, // 30 seconds
  VIDEO_GENERATION_TIMEOUT: 120000, // 2 minutes
  IMAGE_GENERATION_TIMEOUT: 15000, // 15 seconds

  // Rate limiting
  RATE_LIMIT_DELAY: 1000, // ms between requests

  // Polling for async operations
  POLL_INTERVAL: 5000, // 5 seconds
} as const;

// ============================================
// Keyboard Shortcuts
// ============================================

export const SHORTCUTS = {
  // Modifier keys
  MODIFIER: 'metaKey', // 'metaKey' for Mac, 'ctrlKey' for Windows/Linux

  // Actions
  UNDO: ['z'],
  REDO: ['Shift', 'z'],
  COPY: ['c'],
  PASTE: ['v'],
  DELETE: ['Backspace', 'Delete'],
  SELECT_ALL: ['a'],
  ESCAPE: ['Escape'],
  SAVE: ['s'],

  // View
  FIT_VIEW: ['0'],
  ZOOM_IN: ['='],
  ZOOM_OUT: ['-'],
  RESET_VIEW: ['r'],

  // Tools
  SPACE_FOR_PAN: ' ',
} as const;

// ============================================
// Error Messages
// ============================================

export const ERRORS = {
  // Generic errors
  UNKNOWN_ERROR: '发生未知错误',
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  TIMEOUT_ERROR: '请求超时，请稍后重试',

  // API errors
  API_KEY_MISSING: 'API 密钥缺失，请在设置中配置',
  API_KEY_INVALID: 'API 密钥无效，请检查设置',
  API_QUOTA_EXCEEDED: 'API 配额已用完，请稍后重试',
  API_RATE_LIMIT: 'API 请求过于频繁，请稍后重试',

  // Media errors
  IMAGE_LOAD_FAILED: '图片加载失败',
  VIDEO_LOAD_FAILED: '视频加载失败',
  INVALID_IMAGE_FORMAT: '不支持的图片格式',
  INVALID_VIDEO_FORMAT: '不支持的视频格式',
  FILE_TOO_LARGE: '文件过大，请上传更小的文件',

  // Node errors
  NODE_GENERATION_FAILED: '内容生成失败',
  INVALID_PROMPT: '提示词不能为空',
  NO_INPUT_NODE: '请先连接输入节点',
} as const;

// ============================================
// Success Messages
// ============================================

export const SUCCESS = {
  SAVED: '保存成功',
  COPIED: '已复制到剪贴板',
  DELETED: '已删除',
  API_KEY_SAVED: 'API 密钥已保存',
  SETTINGS_SAVED: '设置已保存',
} as const;

// ============================================
// Feature Flags
// ============================================

export const FEATURES = {
  // Enable/disable experimental features
  ENABLE_3D_CAMERA_ANGLE: true,
  ENABLE_SMART_SEQUENCE: true,
  ENABLE_MULTI_FRAME_DOCK: true,
  ENABLE_SONIC_STUDIO: true,

  // Development features
  DEBUG_MODE: process.env.NODE_ENV === 'development',
  VERBOSE_LOGGING: process.env.NODE_ENV === 'development',
} as const;

// ============================================
// Animation Presets
// ============================================

export const ANIMATIONS = {
  FADE_IN: 'animate-in fade-in duration-200',
  FADE_OUT: 'animate-out fade-out duration-200',
  ZOOM_IN: 'animate-in zoom-in-95 duration-200',
  ZOOM_OUT: 'animate-out zoom-out-95 duration-200',
  SLIDE_IN_FROM_TOP: 'animate-in slide-in-from-top-4 duration-300',
  SLIDE_IN_FROM_BOTTOM: 'animate-in slide-in-from-bottom-4 duration-300',
} as const;

// ============================================
// Color Palette (for reference)
// ============================================

export const COLORS = {
  // Primary colors
  CYAN: {
    DEFAULT: '#06b6d4',
    HOVER: '#0891b2',
    LIGHT: '#67e8f9',
  },
  VIOLET: {
    DEFAULT: '#8b5cf6',
    HOVER: '#7c3aed',
    LIGHT: '#c4b5fd',
  },
  EMERALD: {
    DEFAULT: '#10b981',
    HOVER: '#059669',
    LIGHT: '#6ee7b7',
  },

  // Background colors
  BG: {
    PRIMARY: '#0a0a0c',
    SECONDARY: '#1c1c1e',
    TERTIARY: '#2c2c2e',
  },

  // Text colors
  TEXT: {
    PRIMARY: '#ffffff',
    SECONDARY: '#a1a1aa',
    TERTIARY: '#71717a',
  },

  // Status colors
  STATUS: {
    SUCCESS: '#22c55e',
    ERROR: '#ef4444',
    WARNING: '#f59e0b',
    INFO: '#3b82f6',
  },
} as const;

// ============================================
// Type Exports
// ============================================

export type AspectRatio = (typeof MEDIA.IMAGE_ASPECT_RATIOS)[number];
export type ImageResolution = (typeof MEDIA.IMAGE_RESOLUTIONS)[number];
export type VideoResolution = (typeof MEDIA.VIDEO_RESOLUTIONS)[number];
export type GenerationCount = (typeof MEDIA.IMAGE_COUNTS)[number];
