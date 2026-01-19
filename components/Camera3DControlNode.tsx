import React, { useEffect, useMemo, useState } from 'react';
import { AppNode } from '../types';
import {
  Camera3DParams,
  DEFAULT_CAMERA_PARAMS,
  HORIZONTAL_PRESETS,
  VERTICAL_PRESETS,
  ZOOM_PRESETS,
  HorizontalPreset,
  VerticalPreset,
  ZoomPreset,
} from '../types/camera3d';
import {
  build3DViewTitle,
  buildCameraPrompt,
  formatCameraParams,
} from '../utils/cameraPrompt';
import {
  RotateCcw,
  Play,
  Compass,
  Eye,
  Sparkles,
  Camera,
} from 'lucide-react';

interface Camera3DControlNodeProps {
  node: AppNode;
  onUpdate: (
    id: string,
    data: Partial<AppNode['data']>,
    size?: { width?: number; height?: number },
    title?: string
  ) => void;
  onDelete: (id: string) => void;
  onGenerate: (params: Camera3DParams) => void;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const areParamsEqual = (a: Camera3DParams, b: Camera3DParams) =>
  Math.abs(a.horizontal - b.horizontal) < 0.001 &&
  Math.abs(a.vertical - b.vertical) < 0.001 &&
  Math.abs(a.zoom - b.zoom) < 0.001;

const getHorizontalDescriptor = (value: number) => {
  if (value >= 165 || value <= -165) return 'back view';
  if (value > 95) return 'right profile shot';
  if (value > 20) return 'three-quarter right view';
  if (value < -95) return 'left profile shot';
  if (value < -20) return 'three-quarter left view';
  return 'front view';
};

const getVerticalDescriptor = (value: number) => {
  if (value >= 45) return 'bird-eye high angle shot';
  if (value >= 20) return 'elevated angle shot';
  if (value <= -45) return 'worm-eye extreme low angle';
  if (value <= -20) return 'low angle shot';
  return 'eye-level shot';
};

const getZoomDescriptor = (value: number) => {
  if (value <= 2) return 'close-up shot';
  if (value <= 4) return 'medium close shot';
  if (value <= 7) return 'medium shot';
  if (value <= 8.5) return 'wide shot';
  return 'establishing shot';
};

const getPresetFromValue = <T extends string>(
  value: number,
  presets: Record<T, { value: number }>,
  tolerance = 0.01
): T | undefined => {
  const entry = (Object.entries(presets) as [T, { value: number }][])
    .find(([, preset]) => Math.abs(preset.value - value) <= tolerance);
  return entry?.[0];
};

const ToggleButton = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg border transition-all text-[11px] tracking-[0.2em] uppercase ${active ? 'border-cyan-500/60 bg-cyan-500/10 text-cyan-200' : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/30'}`}
  >
    <span>{label}</span>
    <span
      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${active ? 'bg-cyan-500/80 text-black' : 'bg-zinc-800 text-slate-300'}`}
    >
      {active ? 'ON' : 'OFF'}
    </span>
  </button>
);

const Selector = <T extends string>({
  label,
  value,
  options,
  placeholder,
  onChange,
}: {
  label: string;
  value?: T;
  options: Record<T, { value: number; label: string }>;
  placeholder: string;
  onChange: (key: T) => void;
}) => (
  <div className="flex flex-col gap-1 text-[11px] tracking-[0.2em] uppercase text-slate-400">
    <span>{label}</span>
    <div className="relative">
      <select
        className="w-full appearance-none bg-black/40 border border-white/10 rounded-lg py-2 pl-3 pr-8 text-[12px] font-semibold tracking-normal text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/60"
        value={value || ''}
        onChange={e => onChange(e.target.value as T)}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {Object.entries(options).map(([key, option]) => (
          <option key={key} value={key}>
            {option.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
        ▼
      </span>
    </div>
  </div>
);

export const Camera3DControlNode: React.FC<Camera3DControlNodeProps> = ({
  node,
  onUpdate,
  onDelete,
  onGenerate,
}) => {
  const [params, setParams] = useState<Camera3DParams>(
    node.data.camera3DParams || DEFAULT_CAMERA_PARAMS
  );
  const [useDefaultPrompt, setUseDefaultPrompt] = useState(true);
  const [showOrbit, setShowOrbit] = useState(true);

  useEffect(() => {
    const incoming = node.data.camera3DParams || DEFAULT_CAMERA_PARAMS;
    setParams(prev => (areParamsEqual(prev, incoming) ? prev : incoming));
  }, [node.data.camera3DParams]);

  const commitParams = (next: Camera3DParams) => {
    setParams(next);
    onUpdate(node.id, { camera3DParams: next }, undefined, build3DViewTitle(next));
  };

  const handleSliderChange = (
    key: 'horizontal' | 'vertical' | 'zoom',
    value: number
  ) => {
    const cleanValue = Number.isFinite(value) ? value : 0;
    const next = {
      ...params,
      horizontalPreset:
        key === 'horizontal' ? undefined : params.horizontalPreset,
      verticalPreset: key === 'vertical' ? undefined : params.verticalPreset,
      zoomPreset: key === 'zoom' ? undefined : params.zoomPreset,
      [key]:
        key === 'horizontal'
          ? clamp(cleanValue, -180, 180)
          : key === 'vertical'
            ? clamp(cleanValue, -90, 90)
            : clamp(cleanValue, 1, 10),
    } as Camera3DParams;
    commitParams(next);
  };

  const handlePresetSelect = (
    type: 'horizontal' | 'vertical' | 'zoom',
    key: string
  ) => {
    if (type === 'horizontal') {
      const presetKey = key as HorizontalPreset;
      const preset = HORIZONTAL_PRESETS[presetKey];
      if (!preset) return;
      commitParams({
        ...params,
        horizontal: preset.value,
        horizontalPreset: presetKey,
      });
    } else if (type === 'vertical') {
      const presetKey = key as VerticalPreset;
      const preset = VERTICAL_PRESETS[presetKey];
      if (!preset) return;
      commitParams({
        ...params,
        vertical: preset.value,
        verticalPreset: presetKey,
      });
    } else {
      const presetKey = key as ZoomPreset;
      const preset = ZOOM_PRESETS[presetKey];
      if (!preset) return;
      commitParams({
        ...params,
        zoom: preset.value,
        zoomPreset: presetKey,
      });
    }
  };

  const horizontalDescriptor = useMemo(
    () => getHorizontalDescriptor(params.horizontal),
    [params.horizontal]
  );
  const verticalDescriptor = useMemo(
    () => getVerticalDescriptor(params.vertical),
    [params.vertical]
  );
  const zoomDescriptor = useMemo(
    () => getZoomDescriptor(params.zoom),
    [params.zoom]
  );

  const shortPrompt = useMemo(
    () =>
      `<sks> ${horizontalDescriptor} ${verticalDescriptor} ${zoomDescriptor}`,
    [horizontalDescriptor, verticalDescriptor, zoomDescriptor]
  );

  const enhancedPrompt = useMemo(
    () =>
      buildCameraPrompt(
        params,
        useDefaultPrompt ? node.data.sourcePrompt : undefined
      ),
    [params, node.data.sourcePrompt, useDefaultPrompt]
  );

  const orbitRadius = 58 + (10 - params.zoom) * 2.2;
  const horizontalRad = (params.horizontal / 180) * Math.PI;
  const x = Math.sin(horizontalRad) * orbitRadius;
  const y = Math.cos(horizontalRad) * orbitRadius;
  const verticalOffset = (-params.vertical / 90) * 38;

  const cameraDotStyle: React.CSSProperties = {
    transform: `translate(${x}px, ${verticalOffset}px)`
      .concat(` rotate(${params.horizontal}deg)`),
  };

  const focusDotStyle: React.CSSProperties = {
    transform: `translate(${y * 0.15}px, ${-verticalOffset * 0.2}px)`,
  };

  const sourceImage = node.data.sourceImage;
  const canGenerate = Boolean(onGenerate && node.data.sourceImage);

  const selectedHorizontalPreset =
    params.horizontalPreset ||
    getPresetFromValue(params.horizontal, HORIZONTAL_PRESETS, 0.5);
  const selectedVerticalPreset =
    params.verticalPreset ||
    getPresetFromValue(params.vertical, VERTICAL_PRESETS, 0.5);
  const selectedZoomPreset =
    params.zoomPreset ||
    getPresetFromValue(params.zoom, ZOOM_PRESETS, 0.2);

  return (
    <div className="w-full h-full flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-[#141526]/95 to-[#0b0c16]/95 border border-white/10 p-4 text-slate-100 shadow-inner shadow-black/50">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-cyan-400/70">
            Angle Control
          </p>
          <h3 className="mt-1 text-lg font-semibold text-white">
            Qwen Multiangle Camera
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => commitParams(DEFAULT_CAMERA_PARAMS)}
            className="p-2 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:border-white/30 transition-all"
            title="Reset to default"
          >
            <RotateCcw size={16} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(node.id)}
            className="p-2 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-red-300 hover:border-red-400/40 transition-all"
            title="删除节点"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <ToggleButton
          label="Default Prompts"
          active={useDefaultPrompt}
          onClick={() => setUseDefaultPrompt(prev => !prev)}
        />
        <ToggleButton
          label="Camera View"
          active={showOrbit}
          onClick={() => setShowOrbit(prev => !prev)}
        />
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-purple-900/10 via-blue-900/10 to-black/30 p-4">
        {showOrbit && (
          <>
            <div className="absolute inset-0 pointer-events-none opacity-50">
              <div className="absolute left-1/2 top-[18%] h-[55%] w-[55%] -translate-x-1/2 rounded-full border border-cyan-400/30" />
              <div className="absolute left-1/2 top-[18%] h-[55%] w-[55%] -translate-x-1/2 rotate-45 rounded-full border border-purple-400/20" />
            </div>
            <div className="relative flex h-44 items-center justify-center">
              <div className="relative h-28 w-40">
                <div
                  className="absolute left-1/2 top-1/2 h-20 w-16 -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/20 bg-white/5"
                  style={focusDotStyle}
                />
                <div
                  className="absolute left-1/2 top-[15%] h-[70%] w-[70%] -translate-x-1/2 rounded-full border border-cyan-400/30"
                />
                <div
                  className="absolute left-1/2 top-[15%] h-[70%] w-[70%] -translate-x-1/2 blur-xl bg-cyan-400/10"
                />
                <div
                  className="absolute left-1/2 top-[15%] h-[70%] w-[70%] -translate-x-1/2 rotate-90 border border-purple-400/20 rounded-full"
                />
                <div
                  className="absolute left-1/2 top-[15%] h-[70%] w-[70%] -translate-x-1/2"
                  style={cameraDotStyle}
                >
                  <div className="relative">
                    <div className="absolute -left-4 top-1/2 h-[1px] w-8 -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />
                    <div className="relative flex h-6 w-6 items-center justify-center rounded-full border border-cyan-300/70 bg-cyan-500/80 text-black shadow-lg shadow-cyan-500/30">
                      <Camera size={14} />
                    </div>
                  </div>
                </div>
                <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 text-center">
                  <div className="h-10 w-10 rounded-full border border-amber-400/40 bg-amber-500/20 shadow-[0_0_30px_rgba(251,191,36,0.35)]" />
                  <span className="text-[10px] uppercase tracking-[0.3em] text-amber-300/70">
                    Subject
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
        {sourceImage && (
          <div className="absolute right-4 top-4 w-20 overflow-hidden rounded-xl border border-white/20 shadow-lg">
            <img src={sourceImage} alt="source" className="h-full w-full object-cover" />
          </div>
        )}
        <div className="relative flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
          <div className="flex items-center gap-2">
            <Compass size={14} className="text-cyan-400" />
            <span>{horizontalDescriptor}</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye size={14} className="text-emerald-400" />
            <span>{verticalDescriptor}</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-amber-300" />
            <span>{zoomDescriptor}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Selector
          label="Horizontal"
          value={selectedHorizontalPreset}
          options={HORIZONTAL_PRESETS}
          placeholder="自定义"
          onChange={key => handlePresetSelect('horizontal', key)}
        />
        <Selector
          label="Vertical"
          value={selectedVerticalPreset}
          options={VERTICAL_PRESETS}
          placeholder="自定义"
          onChange={key => handlePresetSelect('vertical', key)}
        />
        <Selector
          label="Zoom"
          value={selectedZoomPreset}
          options={ZOOM_PRESETS}
          placeholder="自定义"
          onChange={key => handlePresetSelect('zoom', key)}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-black/30 p-3">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-slate-400">
            <span>Horizontal Angle</span>
            <span className="text-white">{params.horizontal.toFixed(1)}°</span>
          </div>
          <input
            type="range"
            min={-180}
            max={180}
            step={0.5}
            value={params.horizontal}
            onChange={e => handleSliderChange('horizontal', parseFloat(e.target.value))}
            className="mt-3 w-full accent-cyan-500"
          />
        </div>
        <div className="rounded-xl border border-white/10 bg-black/30 p-3">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-slate-400">
            <span>Vertical Angle</span>
            <span className="text-white">{params.vertical.toFixed(1)}°</span>
          </div>
          <input
            type="range"
            min={-90}
            max={90}
            step={0.5}
            value={params.vertical}
            onChange={e => handleSliderChange('vertical', parseFloat(e.target.value))}
            className="mt-3 w-full accent-emerald-400"
          />
        </div>
        <div className="rounded-xl border border-white/10 bg-black/30 p-3">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-slate-400">
            <span>Zoom</span>
            <span className="text-white">{params.zoom.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            step={0.1}
            value={params.zoom}
            onChange={e => handleSliderChange('zoom', parseFloat(e.target.value))}
            className="mt-3 w-full accent-amber-400"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
        <div className="flex justify-between text-[10px] uppercase tracking-[0.4em] text-slate-400">
          <span>Prompt Preview</span>
          <span>{formatCameraParams(params)}</span>
        </div>
        <div className="mt-2 grid grid-cols-1 gap-2 text-[12px] text-slate-200">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 font-mono text-[11px] text-cyan-200">
            {shortPrompt}
          </div>
          <div className="rounded-xl border border-white/10 bg-black/50 p-3 text-[12px] leading-relaxed text-slate-200">
            {enhancedPrompt}
          </div>
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-white/10 bg-black/40 p-3 text-[11px] uppercase tracking-[0.3em] text-slate-400">
          <Compass size={16} className="text-cyan-400" />
          <span>{formatCameraParams(params)}</span>
        </div>
        <button
          type="button"
          onClick={() => canGenerate && onGenerate(params)}
          disabled={!canGenerate}
          className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${canGenerate ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-black shadow-[0_10px_30px_rgba(6,182,212,0.35)] hover:shadow-[0_14px_36px_rgba(99,102,241,0.45)] hover:brightness-105' : 'bg-zinc-800 text-slate-500 cursor-not-allowed'}`}
        >
          <Play size={18} /> 生成新视角
        </button>
      </div>
    </div>
  );
};
