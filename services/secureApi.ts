/**
 * NOVA STUDIO - 安全 API 服务层
 *
 * 所有 API 请求都通过 Vite 开发服务器代理
 * API Key 仅存在于服务器端，前端无法访问
 */

interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

/**
 * 通用的 API 请求函数
 * 所有请求都会被代理到服务器，服务器自动添加 API Key
 */
async function apiRequest<T = any>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const {
    method = 'POST',
    headers = {},
    body,
    timeout = 120000, // 默认 2 分钟超时
  } = options;

  // 使用代理路径
  const proxyUrl = `/api/gemini${endpoint}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(proxyUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message ||
          `API 请求失败: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('请求超时，请稍后重试');
    }
    throw error;
  }
}

/**
 * 错误处理辅助函数
 */
export function getErrorMessage(error: any): string {
  if (!error) return '未知错误';
  if (typeof error === 'string') return error;
  if (error.message) return error.message;
  if (error.error?.message) return error.error.message;
  return JSON.stringify(error);
}

/**
 * 等待函数（用于重试）
 */
export const wait = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * 带重试的 API 请求
 */
export async function retryWithBackoff<T>(
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
        error.status === 503 ||
        error.code === 503 ||
        error.status === 429 ||
        error.code === 429 ||
        msg.includes('overloaded') ||
        msg.includes('503') ||
        msg.includes('429') ||
        msg.includes('too many requests');

      if (isRetryable && i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        console.warn(`API 忙碌，${delay}ms 后重试... (${i + 1}/${maxRetries})`);
        await wait(delay);
        continue;
      }

      throw error;
    }
  }

  throw lastError;
}

// 导出主要的请求函数
export { apiRequest };
