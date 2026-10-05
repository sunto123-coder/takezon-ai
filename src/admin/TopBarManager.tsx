import React, { useState, useEffect } from 'react';
import { TopBarSettings, TopBarItem, WebsiteSettings } from '../types';
import { defaultTopBarSettings } from '../data/seedData';
import { 
  Sliders, 
  Plus, 
  Pencil, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Save, 
  RotateCcw, 
  X, 
  Check, 
  Eye, 
  EyeOff,
  ExternalLink,
  Tag,
  Radio,
  MousePointer
} from 'lucide-react';

interface TopBarManagerProps {
  settings: WebsiteSettings;
  onSave: (topBar: TopBarSettings) => Promise<void>;
  addToast: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const TopBarManager: React.FC<TopBarManagerProps> = ({
  settings,
  onSave,
  addToast,
}) => {
  const [topBar, setTopBar] = useState<TopBarSettings>(() => {
    return settings.topBar && typeof settings.topBar.enabled === 'boolean'
      ? settings.topBar
      : defaultTopBarSettings;
  });
  const [isSaving, setIsSaving] = useState(false);

  // Modal State for Add / Edit Item
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<{
    type: 'badge' | 'text' | 'button' | 'link' | 'status' | 'custom';
    label: string;
    text: string;
    badgeText: string;
    linkUrl: string;
    enabled: boolean;
  }>({
    type: 'text',
    label: '',
    text: '',
    badgeText: '',
    linkUrl: '',
    enabled: true,
  });

  useEffect(() => {
    if (settings.topBar) {
      setTopBar(settings.topBar);
    }
  }, [settings.topBar]);

  const handleToggleGlobal = () => {
    setTopBar((prev) => ({ ...prev, enabled: !prev.enabled }));
  };

  const handleToggleItem = (id: string) => {
    setTopBar((prev) => ({
      ...prev,
      items: prev.items.map((i) =>
        i.id === id ? { ...i, enabled: !i.enabled } : i
      ),
    }));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setTopBar((prev) => {
      const copy = [...prev.items];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return {
        ...prev,
        items: copy.map((i, idx) => ({ ...i, order: idx + 1 })),
      };
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === topBar.items.length - 1) return;
    setTopBar((prev) => {
      const copy = [...prev.items];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return {
        ...prev,
        items: copy.map((i, idx) => ({ ...i, order: idx + 1 })),
      };
    });
  };

  const handleDelete = (id: string) => {
    setTopBar((prev) => ({
      ...prev,
      items: prev.items
        .filter((i) => i.id !== id)
        .map((i, idx) => ({ ...i, order: idx + 1 })),
    }));
    addToast('Item removed from top bar. Click Save to persist.', 'info');
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      type: 'text',
      label: 'New Top Bar Item',
      text: '',
      badgeText: '',
      linkUrl: '',
      enabled: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: TopBarItem) => {
    setEditingId(item.id);
    setForm({
      type: item.type,
      label: item.label,
      text: item.text,
      badgeText: item.badgeText || '',
      linkUrl: item.linkUrl || '',
      enabled: item.enabled !== false,
    });
    setIsModalOpen(true);
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.text.trim()) {
      addToast('Please enter text for this item', 'warning');
      return;
    }

    if (editingId) {
      setTopBar((prev) => ({
        ...prev,
        items: prev.items.map((i) =>
          i.id === editingId
            ? {
                ...i,
                type: form.type,
                label: form.label || form.text,
                text: form.text.trim(),
                badgeText: form.badgeText.trim() || undefined,
                linkUrl: form.linkUrl.trim() || undefined,
                enabled: form.enabled,
              }
            : i
        ),
      }));
      addToast('Top bar item updated.', 'success');
    } else {
      const newItem: TopBarItem = {
        id: 'tb-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 4),
        type: form.type,
        label: form.label || form.text,
        text: form.text.trim(),
        badgeText: form.badgeText.trim() || undefined,
        linkUrl: form.linkUrl.trim() || undefined,
        enabled: form.enabled,
        order: topBar.items.length + 1,
      };
      setTopBar((prev) => ({
        ...prev,
        items: [...prev.items, newItem],
      }));
      addToast('New item added to top bar.', 'success');
    }
    setIsModalOpen(false);
  };

  const handleResetDefaults = () => {
    setTopBar(defaultTopBarSettings);
    addToast('Reset to default USA top bar. Click Save to persist.', 'info');
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await onSave(topBar);
      addToast('Top bar settings saved to Firestore! Live on storefront.', 'success');
    } catch (err: any) {
      addToast('Failed to save top bar: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl text-white flex items-center gap-2">
            <Sliders className="w-6 h-6 text-amber-400" />
            <span>Top Header / Top Bar Control</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Control visibility of the entire top bar or individual elements. Customize announcement text, badges, live status, and buttons.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-slate-700 active:scale-95"
            title="Reset to default items"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Global Master Switch */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading font-black text-lg text-white">
              Master Top Bar Status
            </h2>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                topBar.enabled !== false
                  ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-400'
                  : 'bg-rose-950/80 border border-rose-800 text-rose-400'
              }`}
            >
              {topBar.enabled !== false ? 'Visible on Website' : 'Hidden from Website'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Toggle off to completely hide the announcement bar across all public pages.
          </p>
        </div>

        <button
          type="button"
          onClick={handleToggleGlobal}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-md active:scale-95 ${
            topBar.enabled !== false
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
          }`}
        >
          {topBar.enabled !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          <span>{topBar.enabled !== false ? 'Top Bar Enabled' : 'Top Bar Disabled'}</span>
        </button>
      </div>

      {/* Live Preview Box */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
          <span>Live Storefront Preview</span>
          <span>{topBar.enabled !== false ? 'Active' : 'Disabled (Hidden)'}</span>
        </div>
        {topBar.enabled !== false ? (
          <div className="bg-slate-950 text-slate-300 text-xs py-2 px-3 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-hidden truncate">
              {topBar.items
                .filter((i) => i.enabled !== false && (i.type === 'badge' || i.type === 'text' || i.type === 'custom'))
                .map((i) => (
                  <span key={i.id} className="inline-flex items-center gap-1.5">
                    {i.badgeText && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 uppercase">
                        {i.badgeText}
                      </span>
                    )}
                    <span className="text-slate-200">{i.text}</span>
                  </span>
                ))}
            </div>
            <div className="flex items-center gap-3 text-slate-400 text-[11px]">
              {topBar.items
                .filter((i) => i.enabled !== false && (i.type === 'status' || i.type === 'button' || i.type === 'link'))
                .map((i) => (
                  <span key={i.id} className="inline-flex items-center gap-1 text-slate-300">
                    {i.type === 'status' && <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />}
                    <span>{i.text}</span>
                  </span>
                ))}
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-500 italic p-2 bg-slate-900/50 rounded-xl text-center">
            Top bar is currently hidden. It will not render on the public website.
          </div>
        )}
      </div>

      {/* Top Bar Items List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
          <span>Configurable Elements ({topBar.items.length})</span>
          <span className="text-emerald-400">
            {topBar.items.filter((i) => i.enabled).length} Enabled
          </span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {topBar.items.map((item, idx) => (
            <div
              key={item.id}
              className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                item.enabled ? 'bg-slate-900/60 hover:bg-slate-800/50' : 'bg-slate-950/40 opacity-60'
              }`}
            >
              {/* Left: Reorder & Info */}
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                {/* Reorder Buttons */}
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMoveUp(idx)}
                    disabled={idx === 0}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors"
                    title="Move up"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDown(idx)}
                    disabled={idx === topBar.items.length - 1}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors"
                    title="Move down"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                </div>

                {/* Type Icon Badge */}
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shrink-0">
                  {item.type === 'status' ? (
                    <Radio className="w-4 h-4 text-emerald-400" />
                  ) : item.type === 'button' ? (
                    <MousePointer className="w-4 h-4 text-indigo-400" />
                  ) : (
                    <Tag className="w-4 h-4 text-amber-400" />
                  )}
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-heading font-bold text-white text-sm">
                      {item.label}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 uppercase font-mono">
                      {item.type}
                    </span>
                    {item.badgeText && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black uppercase">
                        Badge: {item.badgeText}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-300 line-clamp-2">
                    &ldquo;{item.text}&rdquo;
                  </div>
                  {item.linkUrl && (
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <span>Target:</span>
                      <span className="text-indigo-400 font-mono">{item.linkUrl}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Toggle Switch & Actions */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleToggleItem(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    item.enabled
                      ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400'
                  }`}
                  title={item.enabled ? 'Click to disable' : 'Click to enable'}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      item.enabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                    }`}
                  />
                  <span>{item.enabled ? 'Enabled' : 'Disabled'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenEdit(item)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-indigo-950/70 text-slate-400 hover:text-indigo-300 border border-slate-700 hover:border-indigo-700 transition-colors cursor-pointer"
                  title="Edit item"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/70 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-700 transition-colors cursor-pointer"
                  title="Delete item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= MODAL: ADD / EDIT TOP BAR ITEM ================= */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-lg text-white">
                    {editingId ? 'Edit Top Bar Element' : 'Add Top Bar Element'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Configure copy, badge, button, or link for the top border area.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Element Type *
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden cursor-pointer"
                >
                  <option value="text">Announcement / Notice Text</option>
                  <option value="button">Button Shortcut</option>
                  <option value="status">Live Status Indicator (with pulse)</option>
                  <option value="link">Hyperlink</option>
                  <option value="custom">Custom Content</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Item Label (Admin Identifier) *
                </label>
                <input
                  type="text"
                  required
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden"
                  placeholder="e.g. Daily Deals Banner"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Displayed Text *
                </label>
                <textarea
                  rows={2}
                  required
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden"
                  placeholder="e.g. Fall Tech Blowout: Up to 50% Off Verified USA Deals & Daily Curated Gear!"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Badge Text (Optional)
                  </label>
                  <input
                    type="text"
                    value={form.badgeText}
                    onChange={(e) => setForm({ ...form, badgeText: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden"
                    placeholder="e.g. USA EXCLUSIVE"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Click Link / Route (Optional)
                  </label>
                  <input
                    type="text"
                    value={form.linkUrl}
                    onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden"
                    placeholder="e.g. offers or admin or https://..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="itemEnabled"
                  checked={form.enabled}
                  onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
                <label
                  htmlFor="itemEnabled"
                  className="text-xs font-bold text-slate-300 cursor-pointer"
                >
                  Enabled & Visible in Top Bar
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md cursor-pointer"
                >
                  {editingId ? 'Update Element' : 'Add Element'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
