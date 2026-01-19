/**
 * 3D 摄影角度转换工具
 * Multi-View Synthesis - 多视角图像生成
 */

export interface CameraAngle {
  id: string;
  name: string;
  description: string;
  icon: string;
  promptModifier: string;
}

/**
 * 预定义的相机角度
 */
export const CAMERA_ANGLES: CameraAngle[] = [
  {
    id: 'front',
    name: '正面视角',
    description: '标准的正面视图',
    icon: '🎯',
    promptModifier: 'front view, eye-level shot',
  },
  {
    id: 'top-down',
    name: '俯视角度',
    description: '从上方俯瞰的视角',
    icon: '⬇️',
    promptModifier: "bird's eye view, top-down perspective, high angle shot",
  },
  {
    id: 'bottom-up',
    name: '仰视角度',
    description: '从下方仰视的视角',
    icon: '⬆️',
    promptModifier: "worm's eye view, low angle shot, looking up",
  },
  {
    id: 'left',
    name: '左侧视角',
    description: '从左侧45度角观看',
    icon: '⬅️',
    promptModifier: 'left side view, 45 degree angle from left',
  },
  {
    id: 'right',
    name: '右侧视角',
    description: '从右侧45度角观看',
    icon: '➡️',
    promptModifier: 'right side view, 45 degree angle from right',
  },
  {
    id: 'back',
    name: '背面视角',
    description: '从后方观看',
    icon: '🔄',
    promptModifier: 'back view, rear perspective',
  },
  {
    id: 'isometric',
    name: '等距视角',
    description: '2.5D 等距投影视角',
    icon: '🎲',
    promptModifier: 'isometric view, 2.5D perspective',
  },
  {
    id: 'dutch-angle',
    name: '荷兰角度',
    description: '倾斜镜头，戏剧性效果',
    icon: '📐',
    promptModifier: 'dutch angle, tilted camera, canted angle',
  },
  {
    id: 'wide-angle',
    name: '广角镜头',
    description: '超广角，夸张透视',
    icon: '🔭',
    promptModifier: 'wide angle lens, ultra wide, fisheye effect',
  },
  {
    id: 'telephoto',
    name: '长焦镜头',
    description: '压缩透视效果',
    icon: '🔬',
    promptModifier:
      'telephoto lens, compressed perspective, shallow depth of field',
  },
  {
    id: 'macro',
    name: '微距视角',
    description: '极近距离特写',
    icon: '🔍',
    promptModifier: 'macro shot, extreme close-up, detail view',
  },
  {
    id: 'aerial',
    name: '航拍视角',
    description: '从高空俯瞰',
    icon: '✈️',
    promptModifier: 'aerial view, drone shot, overhead perspective',
  },
];

/**
 * 构建包含相机角度的提示词
 */
export function buildCameraAnglePrompt(
  basePrompt: string,
  angle: CameraAngle,
  preserveSubject: boolean = true
): string {
  if (preserveSubject) {
    // 保持主体描述，只添加视角信息
    return `${basePrompt}, ${angle.promptModifier}, same subject, consistent lighting, photorealistic`;
  } else {
    return `${basePrompt} from ${angle.promptModifier}`;
  }
}

/**
 * 从参考图片生成多视角提示词
 */
export function generateMultiViewPrompt(
  subjectDescription: string,
  angles: CameraAngle[],
  baseStyle: string = 'photorealistic, 8k, highly detailed'
): Record<string, string> {
  const prompts: Record<string, string> = {};

  angles.forEach(angle => {
    prompts[angle.id] =
      `${subjectDescription}, ${angle.promptModifier}, ${baseStyle}`;
  });

  return prompts;
}

/**
 * 获取相机角度的中文说明
 */
export function getAngleDescription(angleId: string): string {
  const angle = CAMERA_ANGLES.find(a => a.id === angleId);
  return angle ? angle.description : '未知角度';
}

/**
 * 验证相机角度是否有效
 */
export function isValidCameraAngle(angleId: string): boolean {
  return CAMERA_ANGLES.some(a => a.id === angleId);
}
