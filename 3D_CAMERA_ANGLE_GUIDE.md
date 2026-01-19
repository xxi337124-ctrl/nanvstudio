# 🎥 3D 摄影角度转换功能

> **版本**: v1.0
> **更新日期**: 2026-01-19
> **功能**: Multi-View Synthesis - 多视角图像生成

---

## 📖 功能介绍

**3D 摄影角度转换**是一项革命性的 AI 功能，能够从单张静态图片生成多个不同视角的图像。这项技术基于最新的**多视角合成（Multi-View Synthesis）**研究，让你可以：

- ✨ 从一张照片生成 360° 全方位视角
- 🎮 虚拟相机控制（俯视、仰视、侧视等）
- 🎬 创建电影级的镜头运动效果
- 🔄 保持主体一致性，只改变视角

---

## 🎯 核心特性

### 1. **12 种预设相机角度**

| 角度 | 图标 | 说明 | 适用场景 |
|------|------|------|----------|
| **正面视角** | 🎯 | 标准正面视图 | 产品展示、人物肖像 |
| **俯视角度** | ⬇️ | 鸟瞰视角，从上往下 | 建筑摄影、风景航拍 |
| **仰视角度** | ⬆️ | 虫瞰视角，从下往上 | 英雄镜头、建筑仰拍 |
| **左侧视角** | ⬅️ | 左侧 45° 角 | 产品多角度展示 |
| **右侧视角** | ➡️ | 右侧 45° 角 | 产品多角度展示 |
| **背面视角** | 🔄 | 后方视角 | 全方位产品展示 |
| **等距视角** | 🎲 | 2.5D 等距投影 | 游戏素材、技术图解 |
| **荷兰角度** | 📐 | 倾斜镜头 | 戏剧性效果、惊悚氛围 |
| **广角镜头** | 🔭 | 超广角夸张透视 | 建筑摄影、空间感强化 |
| **长焦镜头** | 🔬 | 压缩透视效果 | 人像摄影、背景虚化 |
| **微距视角** | 🔍 | 极近距离特写 | 产品细节、纹理展示 |
| **航拍视角** | ✈️ | 高空俯瞰 | 风景摄影、城市全景 |

### 2. **智能提示词增强**

系统会自动为每个角度添加专业的摄影术语：

```typescript
// 原始提示词
"一个美丽的女孩站在海边"

// 俯视角度自动增强
"一个美丽的女孩站在海边, bird's eye view, top-down perspective, high angle shot, same subject, consistent lighting, photorealistic"
```

### 3. **保持一致性**

- ✅ **主体一致** - 所有角度保持同一主体
- ✅ **光照一致** - 统一的光照条件
- ✅ **风格一致** - 相同的艺术风格
- ✅ **细节保留** - 保持原始图片的细节

---

## 🚀 使用方法

### 方法 1：通过按钮创建

1. **点击**左侧工具栏的 **"3D 视角"** 按钮
2. **上传**一张参考图片（或连接已有的图片节点）
3. **选择**想要的相机角度（可多选）
4. **点击生成**，系统会自动生成多个视角的图片

### 方法 2：工作流连接

```
图片生成节点 → 3D 视角节点 → 多角度图片输出
     ↓              ↓
  原始图片      选择角度（可多选）
                      ↓
              生成多个视角版本
```

---

## 📊 技术原理

### Multi-View Synthesis（多视角合成）

```
输入图片 (2D)
    ↓
AI 深度估计 + 3D 重建
    ↓
虚拟相机渲染
    ↓
多角度输出 (2D)
```

### 核心技术栈

1. **Stable Virtual Camera** - Stability AI 的多视角扩散模型
2. **MV-Adapter** - 即插即用的多视角适配器
3. **ControlNet** - 姿态和深度图控制
4. **Camera Conditioning** - 相机参数嵌入

---

## 💡 实际应用场景

### 1. **电商产品展示**

```
产品主图 → 生成 6 个角度 → 全方位展示
- 正面、背面、左侧、右侧、俯视、仰视
```

### 2. **建筑与房地产**

```
建筑外观图 → 生成航拍+平视 → 虚拟看房体验
- 俯视角度（周边环境）
- 仰视角度（建筑气势）
- 广角镜头（空间感）
```

### 3. **人物摄影**

```
人物肖像 → 生成多角度 → 创意摄影集
- 荷兰角度（戏剧效果）
- 长焦镜头（背景虚化）
- 微距视角（细节特写）
```

### 4. **游戏与动画**

```
角色设计 → 生成多视角 → 3D 建模参考
- 等距视角（游戏素材）
- 多角度（建模参考图）
```

---

## 🎨 提示词示例

### 产品摄影

```typescript
主体: "现代咖啡机, 不锈钢材质, 简约设计"

俯视: "现代咖啡机, bird's eye view, top-down perspective, 产品摄影, studio lighting"
仰视: "现代咖啡机, worm's eye view, low angle shot, 产品摄影, dramatic lighting"
微距: "现代咖啡机, macro shot, extreme close-up, detail view, 产品摄影"
```

### 建筑摄影

```typescript
主体: "现代摩天大楼, 玻璃幕墙"

航拍: "现代摩天大楼, aerial view, drone shot, 建筑摄影, 黄金时刻"
广角: "现代摩天大楼, wide angle lens, ultra wide, 建筑摄影, blue hour"
荷兰角度: "现代摩天大楼, dutch angle, tilted camera, 建筑摄影, cinematic"
```

### 人物摄影

```typescript
主体: "时尚女性模特, 街头风格"

长焦: "时尚女性模特, telephoto lens, compressed perspective, shallow depth of field, 人像摄影"
左侧视角: "时尚女性模特, left side view, 45 degree angle from left, 人像摄影, natural lighting"
右侧视角: "时尚女性模特, right side view, 45 degree angle from right, 人像摄影, natural lighting"
```

---

## ⚙️ 高级配置

### 批量生成

一次生成多个角度：

```typescript
// 选择多个角度
const selectedAngles = ['left', 'right', 'top-down', 'bottom-up'];

// 系统会并行生成
for (const angle of selectedAngles) {
  generateImageWithAngle(referenceImage, angle);
}
```

### 自定义角度参数

除了预设角度，还可以自定义：

- **旋转角度** (0-360°)
- **仰俯角度** (-90° ~ +90°)
- **相机距离** (近景、中景、远景)
- **镜头焦距** (广角、标准、长焦)

---

## 📚 参考资源

### 相关技术论文

- [Stable Virtual Camera: Multi-View Video Generation](https://stability.ai/news/introducing-stable-virtual-camera-multi-view-video-generation-with-3d-camera-control)
- [Precise Camera Control for Text-to-Image Generation](https://openaccess.thecvf.org/content/CVPR2025/papers/Bernal-Berdun_PrecisCam_Precise_Camera_Control_for_Text-to_Image_Generation_CVPR_2025_paper.pdf)
- [MV-Adapter: Multi-view Consistent Image Generation](https://huanngzh.github.io/MV-Adapter-Page/)

### 开源项目

- [Stability-AI/stable-virtual-camera](https://github.com/Stability-AI/stable-virtual-camera)
- [lllyasviel/ControlNet](https://github.com/lllyasviel/ControlNet)
- [CAvia: Camera-controllable Multi-view Video Diffusion](https://ir1d.github.io/Cavia/)

### 在线工具参考

- [Qwen Image Multiple Angles](https://supermaker.ai/blog/qwen-image-multiple-angles-3d-camera-alibabas-breakthrough-in-ai-camera-control/)
- [AI Multiple Angles - Overchat](https://overchat.ai/image/multiple-angles)
- [Meshy - Image to 3D](https://www.meshy.ai/blog/convert-images-to-3d-model)

---

## 🔮 未来计划

- ✅ **12 种预设角度** - 已完成
- 🔄 **360° 全景生成** - 开发中
- 🔄 **视频多视角** - 规划中
- 🔄 **深度图编辑** - 规划中
- 🔄 **自定义相机路径** - 规划中

---

## 💬 常见问题

### Q: 生成的图片和原图差异大吗？
A: 系统使用最先进的一致性保持技术，主体、光照、风格都会尽量保持一致，只改变视角。

### Q: 可以一次生成多少个角度？
A: 理论上没有限制，但建议一次不超过 6 个角度，以保证质量。

### Q: 支持视频多视角吗？
A: 目前支持图片，视频功能正在开发中。

### Q: 生成的图片可以商用吗？
A: 可以，生成的图片版权归你所有。

---

## 📞 技术支持

如有问题或建议，请访问：
- GitHub Issues
- 官方文档
- 社区论坛

**NOVA STUDIO - 让创意无限延伸** 🚀
