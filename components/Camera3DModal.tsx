import React, { useState } from 'react';
import { X, Camera, Sparkles } from 'lucide-react';
import {
  Camera3DParams,
  DEFAULT_CAMERA_PARAMS,
  HORIZONTAL_PRESETS,
  VERTICAL_PRESETS,
  ZOOM_PRESETS,
} from '../types/camera3d';
import { formatCameraParams } from '../utils/cameraPrompt';

interface Camera3DModalProps {
  isOpen: boolean;
  sourceImage: string;
  sourcePrompt?: string;
  onClose: () => void;
  onGenerate: (params: Camera3DParams) => void;
}

export const Camera3DModal: React.FC<Camera3DModalProps> = ({
  isOpen,
  sourceImage,
  sourcePrompt,
  onClose,
  onGenerate,
}) => {
  const [params, setParams] = useState<Camera3DParams>(DEFAULT_CAMERA_PARAMS);

  if (!isOpen) return null;

  const updateParam = (key: keyof Camera3DParams, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const applyPreset = (
    key: 'horizontal' | 'vertical' | 'zoom',
    preset: string,
    value: number
  ) => {
    setParams(prev => ({
      ...prev,
      [`${key}Preset`]: preset,
      [key]: value,
    }));
  };

  const handleGenerate = () => {
    onGenerate(params);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#1c1c1e] border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg">
              <Camera className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">3D 视角生成器</h2>
              <p className="text-xs text-zinc-400">
                调整摄像机角度，生成新视角图片
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Source Image Preview */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-md aspect-video bg-[#0a0a0c] rounded-xl overflow-hidden border border-white/10">
              <img
                src={sourceImage}
                alt="Source"
                className="w-full h-full object-contain"
              />
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-xs text-white/80">
                原图
              </div>
            </div>
          </div>

          {/* Horizontal Angle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">
                水平角度 (Horizontal)
              </label>
              <span className="text-xs text-purple-400 font-mono">
                {params.horizontal.toFixed(0)}°
              </span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              value={params.horizontal}
              onChange={e =>
                updateParam('horizontal', parseFloat(e.target.value))
              }
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:shadow-lg hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
            />
            <div className="flex gap-2">
              {Object.entries(HORIZONTAL_PRESETS).map(
                ([key, { value, label }]) => (
                  <button
                    key={key}
                    onClick={() => applyPreset('horizontal', key, value)}
                    className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                      params.horizontalPreset === key
                        ? 'bg-purple-500/20 border border-purple-500/50 text-purple-400'
                        : 'bg-white/5 border border-white/10 text-zinc-400 hover:bg-white/10'
                    }`}
                  >
                    {label}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Vertical Angle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">
                垂直角度 (Vertical)
              </label>
              <span className="text-xs text-blue-400 font-mono">
                {params.vertical.toFixed(0)}°
              </span>
            </div>
            <input
              type="range"
              min="-90"
              max="90"
              value={params.vertical}
              onChange={e =>
                updateParam('vertical', parseFloat(e.target.value))
              }
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:shadow-lg hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
            />
            <div className="flex gap-2">
              {Object.entries(VERTICAL_PRESETS).map(
                ([key, { value, label }]) => (
                  <button
                    key={key}
                    onClick={() => applyPreset('vertical', key, value)}
                    className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                      params.verticalPreset === key
                        ? 'bg-blue-500/20 border border-blue-500/50 text-blue-400'
                        : 'bg-white/5 border border-white/10 text-zinc-400 hover:bg-white/10'
                    }`}
                  >
                    {label}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Zoom Level */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">
                缩放级别 (Zoom)
              </label>
              <span className="text-xs text-cyan-400 font-mono">
                {params.zoom.toFixed(1)}x
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={params.zoom}
              onChange={e => updateParam('zoom', parseFloat(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:shadow-lg hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
            />
            <div className="flex gap-2">
              {Object.entries(ZOOM_PRESETS).map(([key, { value, label }]) => (
                <button
                  key={key}
                  onClick={() => applyPreset('zoom', key, value)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                    params.zoomPreset === key
                      ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400'
                      : 'bg-white/5 border border-white/10 text-zinc-400 hover:bg-white/10'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 3D Visualization Preview */}
          <div className="bg-[#0a0a0c] rounded-xl p-4 border border-white/10">
            <div className="text-xs text-zinc-500 mb-3 text-center">
              3D 视角预览
            </div>
            <div className="relative w-full h-40 flex items-center justify-center">
              {/* Simple 3D visualization */}
              <svg
                viewBox="0 0 200 120"
                className="w-full h-full"
                style={{
                  transform: `rotateY(${params.horizontal}deg) rotateX(${-params.vertical}deg)`,
                }}
              >
                {/* Ground plane */}
                <ellipse
                  cx="100"
                  cy="80"
                  rx="60"
                  ry="20"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="1"
                />
                {/* Camera icon */}
                <g transform={`translate(100, 50)`}>
                  <rect
                    x="-15"
                    y="-10"
                    width="30"
                    height="20"
                    fill="rgba(168,85,247,0.3)"
                    stroke="rgba(168,85,247,0.8)"
                    strokeWidth="2"
                    rx="3"
                  />
                  <circle cx="0" cy="0" r="5" fill="rgba(34,211,238,0.8)" />
                  {/* View cone */}
                  <path
                    d="M 10 0 L 30 -15 L 30 15 Z"
                    fill="rgba(34,211,238,0.1)"
                    stroke="rgba(34,211,238,0.3)"
                    strokeWidth="1"
                  />
                </g>
              </svg>
            </div>
            <div className="text-center text-xs text-zinc-500 mt-2">
              {formatCameraParams(params)}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-[#0a0a0c]/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white text-sm font-medium rounded-lg transition-all hover:scale-105 shadow-lg hover:shadow-purple-500/25"
          >
            <Sparkles className="w-4 h-4" />
            生成 3D 视角
          </button>
        </div>
      </div>
    </div>
  );
};
