/**
 * 图片处理工具函数
 * 用于验证、裁剪和调整图片尺寸
 */

/**
 * 获取图片的尺寸
 */
export async function getImageDimensions(
  dataUrl: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}

/**
 * 验证图片是否符合指定的宽高比
 * @param dataUrl - 图片的 data URL
 * @param targetAspectRatio - 目标宽高比 (如 "9:16")
 * @param tolerance - 容差范围（百分比，默认 5%）
 */
export async function validateAspectRatio(
  dataUrl: string,
  targetAspectRatio: string,
  tolerance: number = 0.05
): Promise<{
  valid: boolean;
  actualRatio: string;
  dimensions: { width: number; height: number };
}> {
  try {
    const { width, height } = await getImageDimensions(dataUrl);

    // 解析目标宽高比
    const [targetWidth, targetHeight] = targetAspectRatio
      .split(':')
      .map(Number);
    const targetRatio = targetWidth / targetHeight;
    const actualRatio = width / height;

    // 计算差异百分比
    const difference = Math.abs(actualRatio - targetRatio) / targetRatio;
    const isValid = difference <= tolerance;

    // 转换实际比例为字符串
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(Math.round(width), Math.round(height));
    const actualRatioStr = `${Math.round(width) / divisor}:${Math.round(height) / divisor}`;

    return {
      valid: isValid,
      actualRatio: actualRatioStr,
      dimensions: { width, height },
    };
  } catch (error) {
    console.error('验证图片尺寸失败:', error);
    return {
      valid: false,
      actualRatio: 'unknown',
      dimensions: { width: 0, height: 0 },
    };
  }
}

/**
 * 根据目标宽高比计算建议的图片尺寸
 * @param targetAspectRatio - 目标宽高比 (如 "9:16")
 * @param baseSize - 基准尺寸（默认 1024）
 */
export function calculateTargetDimensions(
  targetAspectRatio: string,
  baseSize: number = 1024
): { width: number; height: number } {
  const [widthRatio, heightRatio] = targetAspectRatio.split(':').map(Number);

  if (widthRatio > heightRatio) {
    // 横版
    return {
      width: baseSize,
      height: Math.round(baseSize * (heightRatio / widthRatio)),
    };
  } else if (heightRatio > widthRatio) {
    // 竖版
    return {
      width: Math.round(baseSize * (widthRatio / heightRatio)),
      height: baseSize,
    };
  } else {
    // 正方形
    return { width: baseSize, height: baseSize };
  }
}

/**
 * 裁剪或调整图片到指定宽高比
 * @param dataUrl - 原始图片的 data URL
 * @param targetAspectRatio - 目标宽高比 (如 "9:16")
 * @param quality - 输出质量 (0-1, 默认 0.95)
 */
export async function cropImageToAspectRatio(
  dataUrl: string,
  targetAspectRatio: string,
  quality: number = 0.95
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('无法获取 canvas 上下文'));
          return;
        }

        // 解析目标宽高比
        const [targetWidth, targetHeight] = targetAspectRatio
          .split(':')
          .map(Number);
        const targetRatio = targetWidth / targetHeight;

        let sourceX = 0;
        let sourceY = 0;
        let sourceWidth = img.width;
        let sourceHeight = img.height;

        // 计算裁剪区域
        const currentRatio = img.width / img.height;

        if (currentRatio > targetRatio) {
          // 图片太宽，裁剪两边
          sourceWidth = img.height * targetRatio;
          sourceX = (img.width - sourceWidth) / 2;
        } else if (currentRatio < targetRatio) {
          // 图片太高，裁剪上下
          sourceHeight = img.width / targetRatio;
          sourceY = (img.height - sourceHeight) / 2;
        }

        // 设置画布尺寸
        canvas.width = sourceWidth;
        canvas.height = sourceHeight;

        // 裁剪图片
        ctx.drawImage(
          img,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          0,
          0,
          sourceWidth,
          sourceHeight
        );

        // 转换为 data URL
        const result = canvas.toDataURL('image/png', quality);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}

/**
 * 在控制台输出图片尺寸信息（用于调试）
 */
export async function logImageInfo(
  dataUrl: string,
  label: string = 'Image'
): Promise<void> {
  try {
    const { width, height } = await getImageDimensions(dataUrl);
    const ratio = (width / height).toFixed(2);
    console.log(`📸 ${label}: ${width}x${height} (ratio: ${ratio})`);
  } catch (error) {
    console.error(`❌ 无法获取 ${label} 尺寸:`, error);
  }
}
