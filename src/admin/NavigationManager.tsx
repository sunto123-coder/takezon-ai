import React, { useState, useEffect } from 'react';
import { NavigationItem, Category, WebsiteSettings } from '../types';
import { defaultNavigationItems } from '../data/seedData';
import { 
  Menu, 
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
  Compass,
  Tag
} from 'lucide-react';

interface NavigationManagerProps {
  settings: WebsiteSettings;
  categories: Category[];
  onSave: (items: NavigationItem[]) => Promise<void>;
  addToast: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const NavigationManager: React.FC<NavigationManagerProps> = ({
  settings,
  categories,
  onSave,
  addToast,
}) => {
  const [items, setItems] = useState<NavigationItem[]>(() => {
    return settings.navigationItems && settings.navigationItems.length > 0
      ? settings.navigationItems
      : defaultNavigationItems;
  });
  const [isSaving, setIsSaving] = useState(false);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<{
    label: string;
    url: string;
    badge: string;
    enabled: boolean;
    isExternal: boolean;
  }>({
    label: '',
    url: 'home',
    badge: '',
    enabled: true,
    isExternal: false,
  });

  // Sync if settings update in Firestore
  useEffect(() => {
    if (settings.navigationItems && settings.navigationItems.length > 0) {
      setItems(settings.navigationItems);
    }
  }, [settings.navigationItems]);

  const handleToggle = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setItems((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy.map((item, idx) => ({ ...item, order: idx + 1 }));
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;
    setItems((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy.map((item, idx) => ({ ...item, order: idx + 1 }));
    });
  };

  const handleDelete = (id: string) => {
    setItems((prev) =>
      prev.filter((i) => i.id !== id).map((i, idx) => ({ ...i, order: idx + 1 }))
    );
    addToast('Navigation item removed from list. Click Save Changes to persist.', 'info');
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      label: '',
      url: 'home',
      badge: '',
      enabled: true,
      isExternal: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: NavigationItem) => {
    setEditingId(item.id);
    setForm({
      label: item.label,
      url: item.url,
      badge: item.badge || '',
      enabled: item.enabled !== false,
      isExternal: item.isExternal || item.url.startsWith('http://') || item.url.startsWith('https://'),
    });
    setIsModalOpen(true);
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.label.trim()) {
      addToast('Please enter a menu label', 'warning');
      return;
    }
    if (!form.url.trim()) {
      addToast('Please enter a destination route or URL', 'warning');
      return;
    }

    let categorySlug: string | undefined = undefined;
    if (form.url.startsWith('category:')) {
      categorySlug = form.url.replace('category:', '');
    }

    if (editingId) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === editingId
            ? {
                ...i,
                label: form.label.trim(),
                url: form.url.trim(),
                categorySlug,
                badge: form.badge.trim() || undefined,
                enabled: form.enabled,
                isExternal: form.isExternal || form.url.startsWith('http://') || form.url.startsWith('https://'),
              }
            : i
        )
      );
      addToast('Navigation item updated.', 'success');
    } else {
      const newItem: NavigationItem = {
        id: 'nav-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 4),
        label: form.label.trim(),
        url: form.url.trim(),
        categorySlug,
        badge: form.badge.trim() || undefined,
        enabled: form.enabled,
        order: items.length + 1,
        isExternal: form.isExternal || form.url.startsWith('http://') || form.url.startsWith('https://'),
      };
      setItems((prev) => [...prev, newItem]);
      addToast('New navigation item added to menu.', 'success');
    }
    setIsModalOpen(false);
  };

  const handleResetDefaults = () => {
    setItems(defaultNavigationItems);
    addToast('Reset to default navigation menu. Click Save to persist.', 'info');
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await onSave(items);
      addToast('Navigation menu settings saved to Firestore! Live on storefront.', 'success');
    } catch (err: any) {
      addToast('Failed to save navigation menu: ' + err.message, 'error');
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
            <Compass className="w-6 h-6 text-emerald-400" />
            <span>Main Navigation Menu Control</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete control over storefront navigation links, labels, routes, ordering, and visibility.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-slate-700 active:scale-95"
            title="Reset to default menu items"
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
            <span>Add Menu Item</span>
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

      {/* Info Notice */}
      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/60 text-xs text-indigo-200 flex items-start gap-3">
        <Menu className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-white block">Main Navigation Order & Visibility</span>
          <p className="text-slate-300 leading-relaxed">
            Items toggled <strong className="text-emerald-400">ON</strong> will immediately appear in the desktop navbar and mobile slide-out menu. Disabled items are hidden from public view. Use the arrows to reorder items.
          </p>
        </div>
      </div>

      {/* Navigation Items List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Active Menu Items ({items.filter(i => i.enabled !== false).length} / {items.length} Enabled)
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Drag/reorder with arrows &bull; Click toggle to show/hide
          </span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {items.map((item, index) => {
            const isCat = item.url.startsWith('category:');
            const isExt = item.url.startsWith('http://') || item.url.startsWith('https://');

            return (
              <div 
                key={item.id}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  item.enabled ? 'bg-slate-900 hover:bg-slate-850' : 'bg-slate-950/60 opacity-60'
                }`}
              >
                {/* Left: Drag order + Info */}
                <div className="flex items-center gap-3.5">
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveUp(index)}
                      className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-300 cursor-pointer transition-colors"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === items.length - 1}
                      onClick={() => handleMoveDown(index)}
                      className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-300 cursor-pointer transition-colors"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="w-6 text-center text-xs font-mono font-bold text-slate-500">
                    #{index + 1}
                  </span>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-heading font-bold text-white text-sm">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {item.badge}
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        isCat 
                          ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20' 
                          : isExt 
                            ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20' 
                            : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                      }`}>
                        {isCat ? 'Category Route' : isExt ? 'External Link' : 'Storefront Page'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 font-mono">
                      <span>Route/URL:</span>
                      <span className="text-slate-300 truncate max-w-xs sm:max-w-md">
                        {item.url}
                      </span>
                      {isExt && <ExternalLink className="w-3 h-3 text-slate-500 inline" />}
                    </div>
                  </div>
                </div>

                {/* Right: Status toggle & actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
                  {/* Enable / Disable Toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggle(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                      item.enabled
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    {item.enabled ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Visible (ON)</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hidden (OFF)</span>
                      </>
                    )}
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-indigo-600/30 text-slate-300 hover:text-indigo-300 border border-slate-700 transition-colors cursor-pointer"
                    title="Edit menu item"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600/30 text-slate-300 hover:text-rose-400 border border-slate-700 transition-colors cursor-pointer"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Add / Edit Menu Item */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md p-4 flex items-center justify-center animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div 
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl relative space-y-5 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="font-heading font-black text-lg text-white">
                {editingId ? 'Edit Navigation Item' : 'Add New Navigation Item'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Menu Label *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Products, Smart Living, About Us"
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              {/* Preset Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Quick Route Preset
                </label>
                <select
                  value={form.url}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val !== 'custom') {
                      setForm((prev) => ({
                        ...prev,
                        url: val,
                        label: prev.label || (
                          val === 'home' ? 'Home' :
                          val === 'search' ? 'Products' :
                          val === 'offers' ? 'Offers' :
                          val === 'contact' ? 'Contact' :
                          val.startsWith('category:') ? (categories.find(c => c.slug === val.replace('category:', ''))?.name || 'Category') :
                          prev.label
                        )
                      }));
                    }
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden cursor-pointer"
                >
                  <optgroup label="Standard Storefront Pages">
                    <option value="home">Home Page (home)</option>
                    <option value="search">Products / Search Engine (search)</option>
                    <option value="offers">Special Offers & Deals (offers)</option>
                    <option value="contact">Contact & Support (contact)</option>
                  </optgroup>
                  <optgroup label="Category Discovery Links">
                    {categories.map((c) => (
                      <option key={c.id} value={`category:${c.slug}`}>
                        Category: {c.name}
                      </option>
                    ))}
                  </optgroup>
                  <option value="custom">-- Custom Route / External URL --</option>
                </select>
              </div>

              {/* Exact Route or URL input */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Exact Link / Route URL *
                </label>
                <input
                  type="text"
                  required
                  placeholder="home, offers, contact, category:smart-gadgets, or https://..."
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-mono focus:outline-hidden focus:border-indigo-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Use internal keywords (<code className="text-amber-400">home</code>, <code className="text-amber-400">offers</code>, <code className="text-amber-400">contact</code>, <code className="text-amber-400">search</code>, <code className="text-amber-400">category:slug</code>) or full external URL.
                </p>
              </div>

              {/* Optional Badge */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Optional Badge Text (e.g. HOT, NEW, SALE)
                </label>
                <input
                  type="text"
                  placeholder="Leave empty for no badge"
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.enabled}
                    onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                    className="accent-indigo-600 rounded"
                  />
                  <span>Enable item on public site</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isExternal}
                    onChange={(e) => setForm({ ...form, isExternal: e.target.checked })}
                    className="accent-indigo-600 rounded"
                  />
                  <span>Open in new tab (External)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md cursor-pointer"
                >
                  {editingId ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
