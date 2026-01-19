import React, { useState, useEffect } from 'react';
import { X, Save, Key, ExternalLink } from 'lucide-react';
import { getApiKey, setApiKey, getKeyPreview } from '../services/apiKeyManager';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [polloKey, setPolloKey] = useState('');
  const [openrouterKey, setOpenrouterKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const loadKeys = async () => {
      const [storedPollo, storedOpenRouter] = await Promise.all([
        getApiKey('pollo'),
        getApiKey('openrouter'),
      ]);
      if (storedPollo) setPolloKey(storedPollo);
      if (storedOpenRouter) setOpenrouterKey(storedOpenRouter);
    };

    if (isOpen) {
      loadKeys();
    }
  }, [isOpen]);

  const handleSave = async () => {
    try {
      await Promise.all([
        setApiKey('pollo', polloKey.trim()),
        setApiKey('openrouter', openrouterKey.trim()),
      ]);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
      setTimeout(onClose, 500);
    } catch (error) {
      console.error('Failed to save API keys:', error);
      alert('保存 API 密钥失败，请重试');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-[480px] bg-[#1c1c1e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-700/50 rounded-lg">
              <Key size={16} className="text-white" />
            </div>
            <span className="text-sm font-bold text-white">
              设置 (Settings)
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Pollo.ai API Key (Wan 2.5)
              </label>
              <a
                href="https://pollo.ai/dashboard/api-keys"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <span>获取 Key</span>
                <ExternalLink size={10} />
              </a>
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-slate-500 font-mono text-xs">key-</span>
              </div>
              <input
                type="password"
                autoComplete="off"
                className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-colors font-mono"
                placeholder="粘贴您的 Pollo API Key..."
                value={polloKey}
                onChange={e => setPolloKey(e.target.value)}
              />
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              用于激活 <strong>Wan 2.1 / Wan 2.5</strong>{' '}
              视频生成模型。密钥仅保存在您的浏览器本地存储中，不会上传至 NOVA
              STUDIO 服务器。
            </p>
          </div>

          {/* OpenRouter API Key */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                OpenRouter API Key (Gemini 2.5 Flash)
              </label>
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[10px] text-violet-400 hover:text-violet-300 transition-colors"
              >
                <span>获取 Key</span>
                <ExternalLink size={10} />
              </a>
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-slate-500 font-mono text-xs">key-</span>
              </div>
              <input
                type="password"
                autoComplete="off"
                className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 transition-colors font-mono"
                placeholder="粘贴您的 OpenRouter API Key..."
                value={openrouterKey}
                onChange={e => setOpenrouterKey(e.target.value)}
              />
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              用于调用 <strong>Google Gemini 2.5 Flash</strong> 模型。 支持：
              <span className="text-cyan-400">图片生成</span>、
              <span className="text-violet-400">文本生成</span>、
              <span className="text-emerald-400">视频生成</span>。
              密钥仅保存在本地，不会上传至服务器。
            </p>
            <div className="p-3 bg-violet-500/10 border border-violet-500/20 rounded-lg">
              <p className="text-[10px] text-violet-300 leading-relaxed">
                💡 <strong>已配置默认 Key</strong> - 你也可以使用自己的 Key
                以获得更多配额
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/5 bg-[#121214] flex justify-end">
          <button
            onClick={handleSave}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${isSaved ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-cyan-400'}`}
          >
            {isSaved ? '已保存' : '保存设置'}
          </button>
        </div>
      </div>
    </div>
  );
};
