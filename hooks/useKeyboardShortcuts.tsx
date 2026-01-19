/**
 * NOVA STUDIO - 快捷键 Hook
 *
 * 支持的快捷键：
 * - Ctrl/Cmd + Z: 撤销
 * - Ctrl/Cmd + Shift + Z: 重做
 * - Ctrl/Cmd + Y: 重做
 * - Ctrl/Cmd + C: 复制
 * - Ctrl/Cmd + V: 粘贴
 * - Ctrl/Cmd + X: 剪切
 * - Delete/Backspace: 删除选中
 * - Ctrl/Cmd + A: 全选
 * - Ctrl/Cmd + D: 取消选择
 * - Ctrl/Cmd + S: 保存工作流
 * - Escape: 关闭模态框/取消选择
 */

import { useEffect } from 'react';

interface ShortcutCallbacks {
  onUndo?: () => void;
  onRedo?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onCut?: () => void;
  onDelete?: () => void;
  onSelectAll?: () => void;
  onDeselect?: () => void;
  onSave?: () => void;
  onEscape?: () => void;
}

export const useKeyboardShortcuts = (
  callbacks: ShortcutCallbacks,
  enabled = true
) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // 忽略在输入框中的按键
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true'
      ) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;
      const shift = e.shiftKey;

      // Ctrl/Cmd + Z: 撤销
      if (ctrlOrCmd && !shift && e.key === 'z') {
        e.preventDefault();
        callbacks.onUndo?.();
        return;
      }

      // Ctrl/Cmd + Shift + Z 或 Ctrl/Cmd + Y: 重做
      if (
        (ctrlOrCmd && (shift || e.key === 'y') && e.key === 'z') ||
        (ctrlOrCmd && e.key === 'y')
      ) {
        e.preventDefault();
        callbacks.onRedo?.();
        return;
      }

      // Ctrl/Cmd + C: 复制
      if (ctrlOrCmd && e.key === 'c') {
        e.preventDefault();
        callbacks.onCopy?.();
        return;
      }

      // Ctrl/Cmd + V: 粘贴
      if (ctrlOrCmd && e.key === 'v') {
        e.preventDefault();
        callbacks.onPaste?.();
        return;
      }

      // Ctrl/Cmd + X: 剪切
      if (ctrlOrCmd && e.key === 'x') {
        e.preventDefault();
        callbacks.onCut?.();
        return;
      }

      // Delete / Backspace: 删除选中
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        callbacks.onDelete?.();
        return;
      }

      // Ctrl/Cmd + A: 全选
      if (ctrlOrCmd && e.key === 'a') {
        e.preventDefault();
        callbacks.onSelectAll?.();
        return;
      }

      // Ctrl/Cmd + D: 取消选择
      if (ctrlOrCmd && e.key === 'd') {
        e.preventDefault();
        callbacks.onDeselect?.();
        return;
      }

      // Ctrl/Cmd + S: 保存
      if (ctrlOrCmd && e.key === 's') {
        e.preventDefault();
        callbacks.onSave?.();
        return;
      }

      // Escape: 关闭模态框/取消选择
      if (e.key === 'Escape') {
        e.preventDefault();
        callbacks.onEscape?.();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [callbacks, enabled]);
};

/**
 * 快捷键帮助提示组件
 */
export const KeyboardShortcutsHelp = () => {
  const shortcuts = [
    { key: 'Ctrl+Z', description: '撤销', mac: '⌘+Z' },
    { key: 'Ctrl+Shift+Z', description: '重做', mac: '⌘+⇧+Z' },
    { key: 'Ctrl+C', description: '复制', mac: '⌘+C' },
    { key: 'Ctrl+V', description: '粘贴', mac: '⌘+V' },
    { key: 'Ctrl+X', description: '剪切', mac: '⌘+X' },
    { key: 'Delete', description: '删除选中', mac: 'Delete' },
    { key: 'Ctrl+A', description: '全选', mac: '⌘+A' },
    { key: 'Ctrl+D', description: '取消选择', mac: '⌘+D' },
    { key: 'Ctrl+S', description: '保存', mac: '⌘+S' },
    { key: 'Esc', description: '关闭/取消', mac: 'Esc' },
  ];

  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-bold text-zinc-300 mb-2">快捷键</h3>
      <div className="grid grid-cols-2 gap-2 text-xs">
        {shortcuts.map(shortcut => (
          <div
            key={shortcut.key}
            className="flex items-center justify-between gap-2"
          >
            <kbd className="px-2 py-1 bg-zinc-800 rounded text-zinc-400 font-mono text-[10px]">
              {isMac ? shortcut.mac : shortcut.key}
            </kbd>
            <span className="text-zinc-500">{shortcut.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
