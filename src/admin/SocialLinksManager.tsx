import React, { useState, useEffect } from 'react';
import { SocialMediaLink, SocialPlatformType, WebsiteSettings } from '../types';
import { defaultSocialLinks } from '../data/seedData';
import { SocialIcon } from '../components/SocialIcon';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  X, 
  ExternalLink,
  Share2,
  Save,
  RotateCcw
} from 'lucide-react';

const AVAILABLE_PLATFORMS: { value: SocialPlatformType; label: string; placeholder: string }[] = [
  { value: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/yourpage' },
  { value: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/yourprofile' },
  { value: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@yourchannel' },
  { value: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@yourhandle' },
  { value: 'x', label: 'X / Twitter', placeholder: 'https://x.com/yourhandle' },
  { value: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/yourcompany' },
  { value: 'pinterest', label: 'Pinterest', placeholder: 'https://pinterest.com/youraccount' },
  { value: 'telegram', label: 'Telegram', placeholder: 'https://t.me/yourchannel' },
  { value: 'whatsapp', label: 'WhatsApp', placeholder: 'https://wa.me/18001234567' },
  { value: 'messenger', label: 'Messenger', placeholder: 'https://m.me/yourpage' },
  { value: 'reddit', label: 'Reddit', placeholder: 'https://reddit.com/r/yourcommunity' },
  { value: 'discord', label: 'Discord', placeholder: 'https://discord.gg/yourinvite' },
  { value: 'custom', label: 'Other / Custom Platform', placeholder: 'https://yourplatform.com/profile' },
];

interface SocialLinksManagerProps {
  settings: WebsiteSettings;
  onSave: (links: SocialMediaLink[]) => Promise<void>;
  addToast: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const SocialLinksManager: React.FC<SocialLinksManagerProps> = ({
  settings,
  onSave,
  addToast,
}) => {
  const [links, setLinks] = useState<SocialMediaLink[]>(() => {
    return settings.socialLinks && settings.socialLinks.length > 0
      ? settings.socialLinks
      : defaultSocialLinks;
  });
  const [isSaving, setIsSaving] = useState(false);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<{
    platform: string;
    label: string;
    url: string;
    enabled: boolean;
  }>({
    platform: 'facebook',
    label: 'Facebook',
    url: '',
    enabled: true,
  });

  // Sync when settings change from external / Firestore
  useEffect(() => {
    if (settings.socialLinks && settings.socialLinks.length > 0) {
      setLinks(settings.socialLinks);
    }
  }, [settings.socialLinks]);

  const handleToggle = (id: string) => {
    setLinks((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setLinks((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy.map((item, idx) => ({ ...item, order: idx + 1 }));
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === links.length - 1) return;
    setLinks((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy.map((item, idx) => ({ ...item, order: idx + 1 }));
    });
  };

  const handleDelete = (id: string) => {
    setLinks((prev) => prev.filter((item) => item.id !== id).map((item, idx) => ({ ...item, order: idx + 1 })));
    addToast('Social link removed from list. Click Save to persist.', 'info');
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      platform: 'facebook',
      label: 'Facebook',
      url: '',
      enabled: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: SocialMediaLink) => {
    setEditingId(item.id);
    setForm({
      platform: item.platform,
      label: item.label,
      url: item.url,
      enabled: item.enabled !== false,
    });
    setIsModalOpen(true);
  };

  const handlePlatformChange = (val: string) => {
    const matched = AVAILABLE_PLATFORMS.find((p) => p.value === val);
    setForm((prev) => ({
      ...prev,
      platform: val,
      label: matched ? matched.label : prev.label,
    }));
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.url.trim()) {
      addToast('Please enter a valid URL', 'warning');
      return;
    }

    if (editingId) {
      setLinks((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                platform: form.platform,
                label: form.label,
                url: form.url.trim(),
                enabled: form.enabled,
              }
            : item
        )
      );
      addToast('Social link updated.', 'success');
    } else {
      const newLink: SocialMediaLink = {
        id: 'soc-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 5),
        platform: form.platform,
        label: form.label || form.platform,
        url: form.url.trim(),
        enabled: form.enabled,
        order: links.length + 1,
      };
      setLinks((prev) => [...prev, newLink]);
      addToast('New social link added to list.', 'success');
    }
    setIsModalOpen(false);
  };

  const handleResetDefaults = () => {
    setLinks(defaultSocialLinks);
    addToast('Reset to default USA social links. Click Save to persist.', 'info');
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await onSave(links);
      addToast('Social media links saved to Firestore! Live on storefront.', 'success');
    } catch (err: any) {
      addToast('Failed to save social links: ' + err.message, 'error');
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
            <Share2 className="w-6 h-6 text-indigo-400" />
            <span>Social Media Links Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure social media platforms, URLs, and display order. Only enabled links appear on the public storefront.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-slate-700 active:scale-95"
            title="Reset to default social links"
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
            <span>Add Social Platform</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {/* Social Links List Table / Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
          <span>Configured Platforms ({links.length})</span>
          <span className="text-emerald-400">
            {links.filter((l) => l.enabled && l.url).length} Live on Website
          </span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {links.map((item, idx) => (
            <div
              key={item.id}
              className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                item.enabled ? 'bg-slate-900/60 hover:bg-slate-800/50' : 'bg-slate-950/40 opacity-60'
              }`}
            >
              {/* Left: Icon, Platform name, URL */}
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
                    disabled={idx === links.length - 1}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors"
                    title="Move down"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                </div>

                {/* Platform Icon Badge */}
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shrink-0 shadow-xs">
                  <SocialIcon platform={item.platform} className="w-5 h-5" />
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-white text-sm">
                      {item.label}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 font-mono">
                      #{idx + 1}
                    </span>
                    {!item.url && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950/60 border border-rose-800 text-rose-400 font-medium">
                        Missing URL
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 truncate mt-0.5 flex items-center gap-1.5">
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-amber-400 transition-colors flex items-center gap-1 truncate"
                      >
                        <span className="truncate">{item.url}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-slate-500 italic">No URL configured</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Toggle Switch & Actions */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                {/* Enable/Disable Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggle(item.id)}
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

                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => handleOpenEdit(item)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-indigo-950/70 text-slate-400 hover:text-indigo-300 border border-slate-700 hover:border-indigo-700 transition-colors cursor-pointer"
                  title="Edit link"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/70 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-700 transition-colors cursor-pointer"
                  title="Delete link"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= MODAL: ADD / EDIT SOCIAL LINK ================= */}
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
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-lg text-white">
                    {editingId ? 'Edit Social Media Platform' : 'Add Social Media Platform'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Set up destination URL and visibility for the public storefront.
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
                  Select Platform *
                </label>
                <select
                  value={form.platform}
                  onChange={(e) => handlePlatformChange(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden cursor-pointer"
                >
                  {AVAILABLE_PLATFORMS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Display Label *
                </label>
                <input
                  type="text"
                  required
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden"
                  placeholder="e.g. Official YouTube Channel"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Platform URL *
                </label>
                <input
                  type="url"
                  required
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden"
                  placeholder={
                    AVAILABLE_PLATFORMS.find((p) => p.value === form.platform)?.placeholder ||
                    'https://...'
                  }
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="socialEnabled"
                  checked={form.enabled}
                  onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
                <label
                  htmlFor="socialEnabled"
                  className="text-xs font-bold text-slate-300 cursor-pointer"
                >
                  Enable & Show on Public Storefront
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
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  {editingId ? 'Update Link' : 'Add to List'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
