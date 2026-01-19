/**
 * 3D 视角控制组件（嵌入式版本）
 * 用于在 3D 视角节点中显示角度控制器
 */

import React, { useState, useEffect } from 'react';
import { Camera, RotateCw, Move3D } from 'lucide-react';

interface CameraAngleControlsProps {
  referenceImage: string;
  currentPrompt?: string;
  onConfirm: (
    horizontalAngle: number,
    verticalAngle: number,
    distance: number
  ) => void;
  disabled?: boolean;
}

export const CameraAngleControls: React.FC<CameraAngleControlsProps> = ({
  referenceImage,
  currentPrompt,
  onConfirm,
  disabled = false,
}) => {
  // 水平角度：0-360度
  const [horizontalAngle, setHorizontalAngle] = useState(0);
  // 垂直角度：-90（仰视）到 90（俯视）
  const [verticalAngle, setVerticalAngle] = useState(0);
  // 距离：1（特写）到 10（远景）
  const [distance, setDistance] = useState(5);

  // 生成角度描述
  const getAngleDescription = () => {
    const h = horizontalAngle;
    const v = verticalAngle;

    let horizontal = '';
    if (h >= 337.5 || h < 22.5) horizontal = '正面';
    else if (h >= 22.5 && h < 67.5) horizontal = '右前方';
    else if (h >= 67.5 && h < 112.5) horizontal = '右侧';
    else if (h >= 112.5 && h < 157.5) horizontal = '右后方';
    else if (h >= 157.5 && h < 202.5) horizontal = '背面';
    else if (h >= 202.5 && h < 247.5) horizontal = '左后方';
    else if (h >= 247.5 && h < 292.5) horizontal = '左侧';
    else horizontal = '左前方';

    let vertical = '';
    if (v > 45) vertical = '极度俯视';
    else if (v > 22.5) vertical = '俯视';
    else if (v > -22.5) vertical = '平视';
    else if (v > -45) vertical = '仰视';
    else vertical = '极度仰视';

    let dist = '';
    if (distance <= 2) dist = '特写';
    else if (distance <= 4) dist = '近景';
    else if (distance <= 6) dist = '中景';
    else if (distance <= 8) dist = '远景';
    else dist = '大远景';

    return `${horizontal}，${vertical}，${dist}`;
  };

  const getPromptModifier = () => {
    const h = horizontalAngle;
    const v = verticalAngle;

    let prompt = '';

    // 水平角度
    if (h >= 337.5 || h < 22.5) prompt += 'front view';
    else if (h >= 22.5 && h < 67.5)
      prompt += '45-degree angle from right front';
    else if (h >= 67.5 && h < 112.5) prompt += 'right side view';
    else if (h >= 112.5 && h < 157.5)
      prompt += '45-degree angle from back right';
    else if (h >= 157.5 && h < 202.5) prompt += 'back view';
    else if (h >= 202.5 && h < 247.5)
      prompt += '45-degree angle from back left';
    else if (h >= 247.5 && h < 292.5) prompt += 'left side view';
    else prompt += '45-degree angle from left front';

    // 垂直角度
    if (v > 45) prompt += ", extreme bird's eye view, top-down";
    else if (v > 22.5) prompt += ", high angle shot, bird's eye view";
    else if (v > -22.5) prompt += ', eye-level shot';
    else if (v > -45) prompt += ", low angle shot, worm's eye view";
    else prompt += ", extreme low angle, worm's eye view";

    // 距离
    if (distance <= 2) prompt += ', extreme close-up shot';
    else if (distance <= 4) prompt += ', close-up shot';
    else if (distance <= 6) prompt += ', medium shot';
    else if (distance <= 8) prompt += ', long shot';
    else prompt += ', extreme long shot';

    return prompt;
  };

  const handleConfirm = () => {
    onConfirm(horizontalAngle, verticalAngle, distance);
  };

  const handleReset = () => {
    setHorizontalAngle(0);
    setVerticalAngle(0);
    setDistance(5);
  };

  return (
    <div className="flex flex-col h-full gap-3 p-3">
      {/* 参考图片 */}
      <div className="flex-shrink-0">
        <div className="text-[10px] text-slate-500 mb-1.5">参考图片</div>
        <div className="relative w-full aspect-video bg-black/30 rounded-lg overflow-hidden border border-white/10">
          <img
            src={referenceImage}
            alt="参考"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* 角度控制器 */}
      <div className="flex-1 flex flex-col gap-3 min-h-0">
        <div className="text-[10px] text-slate-500">调节拍摄角度</div>

        {/* 水平旋转 */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <RotateCw size={10} />
              水平旋转
            </span>
            <span className="font-mono">{horizontalAngle}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={horizontalAngle}
            onChange={e => setHorizontalAngle(Number(e.target.value))}
            className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer slider-orange"
            disabled={disabled}
          />
        </div>

        {/* 垂直角度 */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <Move3D size={10} />
              垂直角度
            </span>
            <span className="font-mono">
              {verticalAngle > 0 ? '+' : ''}
              {verticalAngle}°
            </span>
          </div>
          <input
            type="range"
            min="-90"
            max="90"
            value={verticalAngle}
            onChange={e => setVerticalAngle(Number(e.target.value))}
            className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer slider-orange"
            disabled={disabled}
          />
          <div className="flex justify-between text-[8px] text-slate-600">
            <span>仰视 -90°</span>
            <span>俯视 +90°</span>
          </div>
        </div>

        {/* 镜头距离 */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <Camera size={10} />
              镜头距离
            </span>
            <span className="font-mono">{distance}</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="0.5"
            value={distance}
            onChange={e => setDistance(Number(e.target.value))}
            className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer slider-orange"
            disabled={disabled}
          />
          <div className="flex justify-between text-[8px] text-slate-600">
            <span>特写</span>
            <span>远景</span>
          </div>
        </div>
      </div>

      {/* 当前设置预览 */}
      <div className="flex-shrink-0 bg-[#0a0a0f] rounded-lg p-2 border border-white/10">
        <div className="text-[9px] text-slate-500 mb-1">当前视角</div>
        <div className="text-[11px] text-cyan-400 font-medium leading-relaxed">
          {getAngleDescription()}
        </div>
      </div>

      {/* 提示词预览 */}
      <div className="flex-shrink-0 bg-[#0a0a0f] rounded-lg p-2 border border-white/10 max-h-16 overflow-hidden">
        <div className="text-[9px] text-slate-500 mb-1">生成提示词</div>
        <div className="text-[10px] text-slate-400 leading-snug line-clamp-3">
          {currentPrompt}, {getPromptModifier()}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex-shrink-0 flex gap-2">
        <button
          onClick={handleReset}
          className="flex-1 px-3 py-2 rounded-lg text-[11px] font-medium bg-white/5 text-slate-400 hover:bg-white/10 transition-colors"
          disabled={disabled}
        >
          重置
        </button>
        <button
          onClick={handleConfirm}
          disabled={disabled}
          className="flex-1 px-3 py-2 rounded-lg text-[11px] font-medium bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          确认生成
        </button>
      </div>
    </div>
  );
};
