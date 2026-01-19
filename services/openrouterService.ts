/**
 * NOVA STUDIO - OpenRouter API 服务
 *
 * 使用 OpenRouter 作为 API 网关，支持多种 AI 模型
 * 文档: https://openrouter.ai/docs
 */

import * as imageUtils from '../utils/imageUtils';

// OpenRouter API 基础配置
const OPENROUTER_API_KEY =
  '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';
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

/**
 * OpenRouter 模型配置
 */
export const OPENROUTER_MODELS = {
  // Gemini 2.5 Flash (文本)
  geminiFlash: {
    id: 'google/gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    type: 'text',
  },
  // Gemini 2.5 Flash (图片)
  geminiFlashImage: {
    id: 'google/gemini-2.5-flash-image',
    name: 'Gemini 2.5 Flash Image',
    type: 'image',
  },
};

/**
 * 错误处理
 */
const getErrorMessage = (error: any): string => {
  if (!error) return '未知错误';
  if (typeof error === 'string') return error;
  if (error.message) return error.message;
  if (error.error?.message) return error.error.message;
  return JSON.stringify(error);
};

/**
 * 等待函数
 */
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 重试机制
 */
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 2000
): Promise<T> {
  let lastError: any;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      const msg = getErrorMessage(error).toLowerCase();

      // 检查是否是可重试的错误
      const isRetryable =
        error.status === 429 ||
        error.status === 503 ||
        msg.includes('rate limit') ||
        msg.includes('too many requests');

      if (isRetryable && i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        console.warn(
          `OpenRouter API 请求频繁，${delay}ms 后重试... (${i + 1}/${maxRetries})`
        );
        await wait(delay);
        continue;
      }

      throw error;
    }
  }

  throw lastError;
}

/**
 * 发送 OpenRouter API 请求
 */
async function openRouterRequest(
  endpoint: string,
  data: any,
  options: {
    method?: 'GET' | 'POST';
    timeout?: number;
  } = {}
): Promise<Response> {
  const { method = 'POST', timeout = 120000 } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://novastudio.ai', // 你的应用域名
        'X-Title': 'NOVA STUDIO',
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          errorData.error?.message ||
          `API 请求失败: ${response.status}`
      );
    }

    return response;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('请求超时，请稍后重试');
    }
    throw error;
  }
}

/**
 * 文本生成 (使用 Gemini 2.5 Flash)
 * @param prompt - 提示词
 * @param systemInstruction - 系统指令（可选）
 * @returns 生成的文本
 */
export async function generateTextWithOpenRouter(
  prompt: string,
  systemInstruction?: string
): Promise<string> {
  try {
    const response = await openRouterRequest('/chat/completions', {
      model: OPENROUTER_MODELS.geminiFlash.id,
      messages: [
        ...(systemInstruction
          ? [{ role: 'system', content: systemInstruction }]
          : []),
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    });

    const data = await response.json();

    if (data.choices && data.choices[0]?.message?.content) {
      return data.choices[0].message.content;
    }

    throw new Error('未收到有效的响应');
  } catch (error) {
    console.error('OpenRouter 文本生成失败:', error);
    throw error;
  }
}

/**
 * 图片生成 (使用 Gemini 2.5 Flash Image)
 * @param prompt - 图片描述
 * @param aspectRatio - 图片比例 (如 "9:16", "16:9", "1:1")
 * @param referenceImage - 参考图片 (base64)
 * @returns 生成的图片 (base64)
 */
export async function generateImageWithOpenRouter(
  prompt: string,
  aspectRatio: string = '1:1',
  referenceImage?: string
): Promise<string[]> {
  try {
    // 将宽高比转换为 Gemini 格式
    // 支持的比例: "1:1", "3:4", "4:3", "9:16", "16:9"
    const aspectRatioMap: Record<string, string> = {
      '1:1': '1:1',
      '3:4': '3:4',
      '4:3': '4:3',
      '9:16': '9:16',
      '16:9': '16:9',
    };

    const validAspectRatio = aspectRatioMap[aspectRatio] || '1:1';

    // 构建请求内容
    let content: any = prompt;

    // 如果有参考图片，添加到消息中
    if (referenceImage) {
      const base64Data = referenceImage.replace(/^data:image\/\w+;base64,/, '');
      const mimeType =
        referenceImage.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/png';

      content = [
        {
          type: 'image_url',
          image_url: {
            url: `data:${mimeType};base64,${base64Data}`,
          },
        },
        {
          type: 'text',
          text: prompt,
        },
      ];
    }

    const response = await openRouterRequest('/chat/completions', {
      model: OPENROUTER_MODELS.geminiFlashImage.id,
      messages: [{ role: 'user', content }],
      temperature: 0.7,
      // 使用正确的 Gemini API 参数格式
      response_format: {
        type: 'image',
        image_config: {
          aspect_ratio: validAspectRatio,
        },
      },
    });

    const data = await response.json();

    // 解析返回的图片
    if (data.choices && data.choices[0]?.message?.content) {
      const content = data.choices[0].message.content;

      // 尝试提取 base64 图片
      // Gemini 可能返回多种格式，需要解析
      if (typeof content === 'string') {
        // 检查是否包含 base64 图片
        const imageMatch = content.match(
          /data:image\/[^;]+;base64,([a-zA-Z0-9+/=]+)/
        );
        if (imageMatch) {
          const imageData = imageMatch[0];

          // 验证并调整图片尺寸
          console.log(`🔍 [OpenRouter] 验证生成的图片尺寸...`);
          const validation = await imageUtils.validateAspectRatio(
            imageData,
            validAspectRatio
          );

          if (!validation.valid) {
            console.warn(
              `⚠️ [OpenRouter] 图片比例不匹配！期望: ${validAspectRatio}, 实际: ${validation.actualRatio}`
            );
            console.log(
              `📐 实际尺寸: ${validation.dimensions.width}x${validation.dimensions.height}`
            );
            console.log(`✂️ 自动裁剪到 ${validAspectRatio}...`);

            try {
              const croppedImage = await imageUtils.cropImageToAspectRatio(
                imageData,
                validAspectRatio
              );
              console.log(`✅ 裁剪完成`);
              return [croppedImage];
            } catch (cropError) {
              console.error(`❌ 裁剪失败，使用原始图片:`, cropError);
              return [imageData];
            }
          } else {
            console.log(
              `✅ [OpenRouter] 图片比例正确: ${validation.actualRatio}`
            );
            return [imageData];
          }
        }

        // 如果没有 base64，可能返回的是图片 URL
        // TODO: 处理 URL 的情况
        return [content];
      }

      // 可能是数组格式（多张图片）
      if (Array.isArray(content)) {
        const images: string[] = [];
        for (const item of content) {
          if (item.type === 'image_url' && item.image_url?.url) {
            images.push(item.image_url.url);
          }
        }
        if (images.length > 0) {
          return images;
        }
      }
    }

    throw new Error('图片生成失败，未收到有效的图片数据');
  } catch (error) {
    console.error('OpenRouter 图片生成失败:', error);
    throw error;
  }
}

/**
 * 视频生成
 * @param prompt - 视频描述
 * @param options - 生成选项
 * @returns 视频数据或 URL
 */
export async function generateVideoWithOpenRouter(
  prompt: string,
  options: {
    aspectRatio?: string;
    duration?: number;
  } = {}
): Promise<string> {
  try {
    const response = await openRouterRequest('/chat/completions', {
      model: OPENROUTER_MODELS.geminiFlash.id,
      messages: [{ role: 'user', content: `生成一个视频: ${prompt}` }],
      temperature: 0.7,
    });

    const data = await response.json();

    // Gemini Flash 可能不支持视频生成
    // 这里返回生成的描述或占位符
    if (data.choices && data.choices[0]?.message?.content) {
      return data.choices[0].message.content;
    }

    throw new Error('视频生成功能暂不支持');
  } catch (error) {
    console.error('OpenRouter 视频生成失败:', error);
    throw error;
  }
}

/**
 * 多模态生成 (支持图片输入)
 * @param prompt - 提示词
 * @param imageBase64 - 输入图片 (base64)
 * @param systemInstruction - 系统指令
 * @returns 生成结果
 */
export async function generateMultiModalWithOpenRouter(
  prompt: string,
  imageBase64?: string,
  systemInstruction?: string
): Promise<string> {
  try {
    const messages: any[] = [];

    if (systemInstruction) {
      messages.push({ role: 'system', content: systemInstruction });
    }

    // 添加用户消息
    const userMessage: any = { role: 'user', content: [] };

    // 添加文本
    userMessage.content.push({ type: 'text', text: prompt });

    // 添加图片（如果有）
    if (imageBase64) {
      // 提取 base64 数据
      const base64Data = imageBase64.replace(/^data:image\/[^;]+;base64,/, '');
      userMessage.content.push({
        type: 'image_url',
        image_url: {
          url: `data:image/png;base64,${base64Data}`,
        },
      });
    }

    messages.push(userMessage);

    const response = await openRouterRequest('/chat/completions', {
      model: OPENROUTER_MODELS.geminiFlash.id,
      messages,
      temperature: 0.7,
    });

    const data = await response.json();

    if (data.choices && data.choices[0]?.message?.content) {
      return data.choices[0].message.content;
    }

    throw new Error('多模态生成失败');
  } catch (error) {
    console.error('OpenRouter 多模态生成失败:', error);
    throw error;
  }
}

/**
 * 获取 OpenRouter 使用情况
 * @returns API 使用信息
 */
export async function getOpenRouterUsage(): Promise<any> {
  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/auth/key`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      },
    });

    if (response.ok) {
      return await response.json();
    }

    return null;
  } catch (error) {
    console.error('获取 API 使用情况失败:', error);
    return null;
  }
}
