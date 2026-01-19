/**
 * 3D 相机角度控制盘
 * 可视化的圆形角度选择器
 */

import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface CameraAngleDialProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAngle: (angleId: string) => void;
  referenceImage?: string;
  currentPrompt?: string;
}

interface CameraAngleOption {
  id: string;
  name: string;
  icon: string;
  angle: number; // 0-360度
  description: string;
  promptModifier: string;
}

const ANGLE_OPTIONS: CameraAngleOption[] = [
  {
    id: 'front',
    name: '正面',
    icon: '🎯',
    angle: 0,
    description: '标准正面视图',
    promptModifier: 'front view, eye-level shot',
  },
  {
    id: 'front-right',
    name: '右前',
    icon: '↗️',
    angle: 45,
    description: '右前45度',
    promptModifier: '45 degree angle from right',
  },
  {
    id: 'right',
    name: '右侧',
    icon: '➡️',
    angle: 90,
    description: '纯右侧视图',
    promptModifier: 'right side view',
  },
  {
    id: 'back-right',
    name: '右后',
    icon: '↘️',
    angle: 135,
    description: '右后45度',
    promptModifier: '45 degree angle from back right',
  },
  {
    id: 'back',
    name: '背面',
    icon: '🔄',
    angle: 180,
    description: '后方视图',
    promptModifier: 'back view',
  },
  {
    id: 'back-left',
    name: '左后',
    icon: '↙️',
    angle: 225,
    description: '左后45度',
    promptModifier: '45 degree angle from back left',
  },
  {
    id: 'left',
    name: '左侧',
    icon: '⬅️',
    angle: 270,
    description: '纯左侧视图',
    promptModifier: 'left side view',
  },
  {
    id: 'front-left',
    name: '左前',
    icon: '↖️',
    angle: 315,
    description: '左前45度',
    promptModifier: '45 degree angle from left',
  },
  // 垂直角度
  {
    id: 'top-down',
    name: '俯视',
    icon: '⬇️',
    angle: -1,
    description: '从上方俯瞰',
    promptModifier: "bird's eye view, top-down",
  },
  {
    id: 'bottom-up',
    name: '仰视',
    icon: '⬆️',
    angle: -2,
    description: '从下方仰视',
    promptModifier: "worm's eye view, low angle",
  },
];

export const CameraAngleDial: React.FC<CameraAngleDialProps> = ({
  isOpen,
  onClose,
  onSelectAngle,
  referenceImage,
  currentPrompt,
}) => {
  const [selectedAngle, setSelectedAngle] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const dialRef = useRef<HTMLDivElement>(null);

  // 计算旋钮在圆周上的位置
  const getKnobPosition = (angle: number) => {
    const radius = 80; // 圆的半径
    const centerX = 100;
    const centerY = 100;

    if (angle === -1) return { x: centerX, y: centerY - 80 }; // 俯视
    if (angle === -2) return { x: centerX, y: centerY + 80 }; // 仰视

    const radian = (angle - 90) * (Math.PI / 180);
    return {
      x: centerX + radius * Math.cos(radian),
      y: centerY + radius * Math.sin(radian),
    };
  };

  // 处理圆盘点击
  const handleDialClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dialRef.current) return;

    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const clickX = e.clientX - centerX;
    const clickY = e.clientY - centerY;

    // 计算点击位置的角度
    let angle = Math.atan2(clickY, clickX) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    // 查找最接近的角度选项
    const closestAngle = ANGLE_OPTIONS.find(
      opt =>
        opt.angle === angle ||
        (opt.angle === -1 && clickY < -50) ||
        (opt.angle === -2 && clickY > 50)
    );

    if (closestAngle) {
      setSelectedAngle(closestAngle.angle);
      onSelectAngle(closestAngle.id);
    }
  };

  // 处理拖动
  const handleDialMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !dialRef.current) return;

    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dragX = e.clientX - centerX;
    const dragY = e.clientY - centerY;

    let angle = Math.atan2(dragY, dragX) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    setSelectedAngle(angle);
  };

  const handleDialMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);

      // 找到最接近的角度选项
      const closestAngle = ANGLE_OPTIONS.find(
        opt =>
          Math.abs(
            opt.angle -
              (selectedAngle === -1 || selectedAngle === -2
                ? selectedAngle === -1
                  ? -1
                  : 270
                : selectedAngle)
          ) < 45
      );

      if (closestAngle) {
        onSelectAngle(closestAngle.id);
      }
    }
  };

  // 获取当前选中的角度选项
  const getCurrentAngleOption = () => {
    return ANGLE_OPTIONS.find(opt => opt.angle === selectedAngle);
  };

  if (!isOpen) return null;

  const currentOption = getCurrentAngleOption();

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-[#1c1c1e] border border-white/10 rounded-2xl shadow-2xl max-w-2xl w-full"
        onClick={e => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="p-4 border-b border-white/5 flex justify-between items-center">
          <div>
            <h3 className="text-[15px] font-bold text-white flex items-center gap-2">
              🎥 3D 相机角度选择
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              点击或拖动圆盘选择视角，生成不同角度的图片
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* 主内容区 */}
        <div className="p-6">
          <div className="flex gap-8">
            {/* 左侧：圆形控制器 */}
            <div className="flex-shrink-0">
              <div
                ref={dialRef}
                className="relative w-[200px] h-[200px] bg-[#0a0a0f] rounded-full border-2 border-white/10 cursor-pointer select-none"
                onClick={handleDialClick}
                onMouseMove={handleDialMouseMove}
                onMouseUp={handleDialMouseUp}
                onMouseDown={() => setIsDragging(true)}
              >
                {/* 角度标记 */}
                {ANGLE_OPTIONS.slice(0, 8).map(opt => {
                  const pos = getKnobPosition(opt.angle);
                  const isActive =
                    Math.abs(opt.angle - selectedAngle) < 45 ||
                    (selectedAngle === -1 && opt.angle === 0) ||
                    (selectedAngle === -2 && opt.angle === 180);

                  return (
                    <div
                      key={opt.id}
                      className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-lg cursor-pointer transition-all ${
                        isActive
                          ? 'bg-orange-500 text-white scale-125 shadow-lg shadow-orange-500/50'
                          : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200 hover:scale-110'
                      }`}
                      style={{
                        left: `${pos.x - 16}px`,
                        top: `${pos.y - 16}px`,
                      }}
                      title={opt.name}
                    >
                      {opt.icon}
                    </div>
                  );
                })}

                {/* 中心：当前角度 */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg">
                    {currentOption?.icon || '🎯'}
                  </div>
                </div>

                {/* 俯视/仰视按钮 */}
                <div
                  className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center cursor-pointer border border-white/10 transition-all"
                  onClick={e => {
                    e.stopPropagation();
                    setSelectedAngle(-1);
                    onSelectAngle('top-down');
                  }}
                  title="俯视"
                >
                  ⬇️
                </div>
                <div
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center cursor-pointer border border-white/10 transition-all"
                  onClick={e => {
                    e.stopPropagation();
                    setSelectedAngle(-2);
                    onSelectAngle('bottom-up');
                  }}
                  title="仰视"
                >
                  ⬆️
                </div>
              </div>

              {/* 当前角度说明 */}
              <div className="text-center mt-4">
                <div className="text-2xl mb-1">
                  {currentOption?.icon || '🎯'}
                </div>
                <div className="text-[13px] text-white font-medium">
                  {currentOption?.name || '正面视角'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {currentOption?.description || '标准的正面视图'}
                </div>
              </div>
            </div>

            {/* 右侧：参考图片和说明 */}
            <div className="flex-1">
              {referenceImage && (
                <div className="mb-4">
                  <div className="text-[11px] text-slate-500 mb-2">
                    参考图片
                  </div>
                  <img
                    src={referenceImage}
                    alt="参考"
                    className="w-full h-32 object-cover rounded-lg border border-white/10"
                  />
                </div>
              )}

              <div className="bg-[#0a0a0f] rounded-lg p-3 border border-white/10">
                <div className="text-[11px] text-slate-500 mb-2">
                  将使用提示词
                </div>
                <div className="text-[12px] text-slate-300 leading-relaxed">
                  {currentPrompt || '生成的图片'},{' '}
                  {currentOption?.promptModifier || 'front view'}
                </div>
              </div>

              {/* 快速选择按钮 */}
              <div className="mt-4">
                <div className="text-[11px] text-slate-500 mb-2">快速选择</div>
                <div className="grid grid-cols-4 gap-2">
                  {ANGLE_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setSelectedAngle(opt.angle);
                        onSelectAngle(opt.id);
                      }}
                      className={`px-2 py-2 rounded-lg text-center transition-all ${
                        Math.abs(
                          opt.angle -
                            (selectedAngle === -1 || selectedAngle === -2
                              ? selectedAngle === -1
                                ? 0
                                : 270
                              : selectedAngle)
                        ) < 45
                          ? 'bg-orange-500 text-white'
                          : 'bg-white/5 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-base">{opt.icon}</div>
                      <div className="text-[9px] mt-0.5">{opt.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="p-4 border-t border-white/5 bg-[#121214] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-[13px] font-medium bg-white/5 text-slate-400 hover:bg-white/10 transition-colors"
          >
            取消
          </button>
          <button
            onClick={() => {
              if (currentOption) {
                onSelectAngle(currentOption.id);
                onClose();
              }
            }}
            className="px-4 py-2 rounded-lg text-[13px] font-medium bg-orange-500 text-white hover:bg-orange-600 transition-colors"
          >
            确认生成
          </button>
        </div>
      </div>
    </div>
  );
};
