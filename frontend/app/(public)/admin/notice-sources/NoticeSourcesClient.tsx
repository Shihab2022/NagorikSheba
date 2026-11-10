"use client";

import { useState } from "react";
import {
  Bell,
  Play,
  FlaskConical,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Globe,
  Database,
} from "lucide-react";
import type { NoticeSourceItem } from "@/lib/types";
import type { CategoryItem } from "@/types/category";
import {
  createNoticeSource,
  updateNoticeSource,
  deleteNoticeSource,
  testNoticeSource,
  runNoticeSource,
} from "@/service/notices";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Props {
  initialSources: NoticeSourceItem[];
  categories: CategoryItem[];
}

export function NoticeSourcesClient({ initialSources, categories }: Props) {
  const [sources, setSources] = useState<NoticeSourceItem[]>(initialSources);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<NoticeSourceItem | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [listUrl, setListUrl] = useState("");
  const [scraperType, setScraperType] = useState<"html" | "rss">("html");
  const [fetchIntervalMinutes, setFetchIntervalMinutes] = useState(360);
  const [isActive, setIsActive] = useState(true);

  // HTML Config fields
  const [itemSelector, setItemSelector] = useState("table tbody tr");
  const [titleSelector, setTitleSelector] = useState("td:nth-child(2) a");
  const [linkSelector, setLinkSelector] = useState("td:nth-child(2) a");
  const [dateSelector, setDateSelector] = useState("td:nth-child(3)");
  const [maxItems, setMaxItems] = useState(30);

  // Action status state
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [runningAction, setRunningAction] = useState<"test" | "run" | "save" | null>(null);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Dry run test modal state
  const [testResult, setTestResult] = useState<{
    sourceName: string;
    success: boolean;
    itemsFound: number;
    previewItems?: any[];
    error?: string;
    durationMs: number;
  } | null>(null);

  const resetForm = () => {
    setEditingSource(null);
    setName("");
    setCategoryId(categories[0]?.id || "");
    setListUrl("");
    setScraperType("html");
    setFetchIntervalMinutes(360);
    setIsActive(true);
    setItemSelector("table tbody tr");
    setTitleSelector("td:nth-child(2) a");
    setLinkSelector("td:nth-child(2) a");
    setDateSelector("td:nth-child(3)");
    setMaxItems(30);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (s: NoticeSourceItem) => {
    setEditingSource(s);
    setName(s.name);
    setCategoryId(s.categoryId);
    setListUrl(s.listUrl);
    setScraperType((s.scraperType as "html" | "rss") || "html");
    setFetchIntervalMinutes(s.fetchIntervalMinutes || 360);
    setIsActive(s.isActive);

    const cfg = s.config || {};
    setItemSelector(cfg.itemSelector || "table tbody tr");
    setTitleSelector(cfg.titleSelector || "td:nth-child(2) a");
    setLinkSelector(cfg.linkSelector || "td:nth-child(2) a");
    setDateSelector(cfg.dateSelector || "");
    setMaxItems(cfg.maxItems || 30);

    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setRunningAction("save");
    setActionMessage(null);

    const config =
      scraperType === "html"
        ? {
            itemSelector,
            titleSelector,
            linkSelector,
            dateSelector: dateSelector || undefined,
            maxItems: Number(maxItems) || 30,
          }
        : { maxItems: Number(maxItems) || 50 };

    try {
      if (editingSource) {
        const res = await updateNoticeSource(editingSource.id, {
          name,
          categoryId,
          listUrl,
          scraperType,
          config,
          isActive,
          fetchIntervalMinutes: Number(fetchIntervalMinutes),
        });

        if (res.success) {
          setSources((prev) =>
            prev.map((item) =>
              item.id === editingSource.id
                ? {
                    ...item,
                    name,
                    categoryId,
                    listUrl,
                    scraperType,
                    config,
                    isActive,
                    fetchIntervalMinutes: Number(fetchIntervalMinutes),
                    categoryName: categories.find((c) => c.id === categoryId)?.name,
                  }
                : item
            )
          );
          setIsModalOpen(false);
          setActionMessage({ text: "Notice source updated successfully!", type: "success" });
        } else {
          setActionMessage({ text: res.message || "Failed to update source", type: "error" });
        }
      } else {
        const res = await createNoticeSource({
          name,
          categoryId,
          listUrl,
          scraperType,
          config,
          isActive,
          fetchIntervalMinutes: Number(fetchIntervalMinutes),
        });

        if (res.success && res.data) {
          const created: NoticeSourceItem = {
            ...res.data,
            categoryName: categories.find((c) => c.id === categoryId)?.name,
            noticeCount: 0,
            consecutiveFailures: 0,
            lastStatus: null,
            lastError: null,
            lastFetchedAt: null,
          };
          setSources((prev) => [created, ...prev]);
          setIsModalOpen(false);
          setActionMessage({ text: "Notice source created successfully!", type: "success" });
        } else {
          setActionMessage({ text: res.message || "Failed to create source", type: "error" });
        }
      }
    } catch (err: any) {
      setActionMessage({ text: err.message || "Network error", type: "error" });
    } finally {
      setRunningAction(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this notice source? Scraped notices will remain assigned to the category.")) return;

    try {
      const res = await deleteNoticeSource(id);
      if (res.success) {
        setSources((prev) => prev.filter((s) => s.id !== id));
        setActionMessage({ text: "Notice source deleted successfully", type: "success" });
      } else {
        alert(res.message || "Failed to delete source");
      }
    } catch (e: any) {
      alert(e.message || "Error deleting source");
    }
  };

  const handleTest = async (source: NoticeSourceItem) => {
    setLoadingId(source.id);
    setRunningAction("test");
    try {
      const res = await testNoticeSource(source.id);
      if (res.success && res.data) {
        setTestResult(res.data);
      } else {
        alert(res.message || "Failed to run dry-run test");
      }
    } catch (e: any) {
      alert(e.message || "Test error");
    } finally {
      setLoadingId(null);
      setRunningAction(null);
    }
  };

  const handleRunNow = async (source: NoticeSourceItem) => {
    setLoadingId(source.id);
    setRunningAction("run");
    try {
      const res = await runNoticeSource(source.id);
      if (res.success && res.data) {
        const d = res.data;
        alert(
          `Scrape completed for "${source.name}"!\nFound: ${d.itemsFound} items\nInserted: ${d.itemsInserted} new notices\nDuration: ${d.durationMs}ms`
        );
        // Refresh status in local state
        setSources((prev) =>
          prev.map((s) =>
            s.id === source.id
              ? {
                  ...s,
                  lastStatus: d.success ? "success" : "failed",
                  lastError: d.error || null,
                  lastFetchedAt: new Date().toISOString(),
                  noticeCount: (s.noticeCount || 0) + (d.itemsInserted || 0),
                  consecutiveFailures: d.success ? 0 : s.consecutiveFailures + 1,
                }
              : s
          )
        );
      } else {
        alert(res.message || "Scraper execution failed");
      }
    } catch (e: any) {
      alert(e.message || "Execution error");
    } finally {
      setLoadingId(null);
      setRunningAction(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Government Notice Sources
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Configure automated scrapers for ministries, directorates, and boards.
          </p>
        </div>

        <Button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-brand-800"
        >
          <Plus className="h-4 w-4" />
          Add Notice Source
        </Button>
      </div>

      {actionMessage && (
        <div
          className={cn(
            "p-4 rounded-xl text-sm font-medium border flex items-center justify-between",
            actionMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          )}
        >
          <span>{actionMessage.text}</span>
          <button onClick={() => setActionMessage(null)} className="text-xs font-bold underline ml-4">
            Dismiss
          </button>
        </div>
      )}

      {/* Sources Table */}
      <div className="rounded-2xl border border-line bg-white shadow-card overflow-hidden">
        {sources.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-3 text-base font-bold text-slate-800">No notice sources configured</h3>
            <p className="mt-1 text-sm text-slate-500">
              Click &quot;Add Notice Source&quot; above to setup a scraper for government portals.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-line text-xs uppercase font-bold text-slate-500">
                <tr>
                  <th className="px-6 py-4">Source Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status & Failures</th>
                  <th className="px-6 py-4">Last Fetched</th>
                  <th className="px-6 py-4">Notices</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {sources.map((source) => {
                  const isFailing = source.consecutiveFailures >= 3;
                  const isBusy = loadingId === source.id;

                  return (
                    <tr key={source.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span>{source.name}</span>
                            {!source.isActive && (
                              <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                                Inactive
                              </span>
                            )}
                          </div>
                          <a
                            href={source.listUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-normal text-brand-600 hover:underline flex items-center gap-1 line-clamp-1"
                          >
                            <Globe className="h-3 w-3 text-slate-400 shrink-0" />
                            {source.listUrl}
                          </a>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                          <Database className="h-3 w-3 text-slate-400" />
                          {source.categoryName || "Unknown"}
                        </span>
                      </td>

                      <td className="px-6 py-4 uppercase font-bold text-xs text-slate-500">
                        {source.scraperType}
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {source.lastStatus === "success" && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <CheckCircle className="h-3 w-3" />
                              Healthy
                            </span>
                          )}
                          {source.lastStatus === "failed" && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                              <XCircle className="h-3 w-3" />
                              Failed
                            </span>
                          )}
                          {!source.lastStatus && (
                            <span className="text-xs text-slate-400">Never run</span>
                          )}

                          {isFailing && (
                            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700">
                              <AlertTriangle className="h-3 w-3" />
                              {source.consecutiveFailures} consecutive failures! Check selectors.
                            </div>
                          )}

                          {source.lastError && (
                            <p className="text-[11px] text-red-600 line-clamp-1 max-w-xs" title={source.lastError}>
                              {source.lastError}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-500">
                        {source.lastFetchedAt ? (
                          <span title={new Date(source.lastFetchedAt).toLocaleString()}>
                            {new Date(source.lastFetchedAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>

                      <td className="px-6 py-4 font-bold text-slate-700 text-xs">
                        {source.noticeCount ?? 0}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Test (Dry Run) Button */}
                          <button
                            onClick={() => handleTest(source)}
                            disabled={isBusy}
                            title="Dry Run Test (previews top 5 items without saving)"
                            className="inline-flex items-center gap-1 rounded-lg border border-line bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-brand-300 disabled:opacity-50"
                          >
                            {isBusy && runningAction === "test" ? (
                              <Loader2 className="h-3 w-3 animate-spin text-brand-600" />
                            ) : (
                              <FlaskConical className="h-3 w-3 text-purple-600" />
                            )}
                            Test
                          </button>

                          {/* Run Now Button */}
                          <button
                            onClick={() => handleRunNow(source)}
                            disabled={isBusy}
                            title="Scrape and import notices immediately"
                            className="inline-flex items-center gap-1 rounded-lg border border-line bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-brand-300 disabled:opacity-50"
                          >
                            {isBusy && runningAction === "run" ? (
                              <Loader2 className="h-3 w-3 animate-spin text-brand-600" />
                            ) : (
                              <Play className="h-3 w-3 text-emerald-600" />
                            )}
                            Run
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => openEditModal(source)}
                            className="p-1.5 text-slate-500 hover:text-brand-700 rounded-lg hover:bg-slate-100"
                            title="Edit source"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(source.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                            title="Delete source"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              {editingSource ? "Edit Notice Source" : "Create Notice Source"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Source Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NBR Income Tax Circulars"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-line px-3.5 py-2 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Category (from DB)
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full rounded-xl border border-line px-3.5 py-2 text-sm focus:border-brand-500 focus:outline-none bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Scraper Type
                  </label>
                  <select
                    value={scraperType}
                    onChange={(e) => setScraperType(e.target.value as "html" | "rss")}
                    className="w-full rounded-xl border border-line px-3.5 py-2 text-sm focus:border-brand-500 focus:outline-none bg-white"
                  >
                    <option value="html">HTML (CSS Selectors)</option>
                    <option value="rss">RSS / Atom Feed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Notice Listing URL (Outbound SSRF Protected)
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://nbr.gov.bd/notices"
                  value={listUrl}
                  onChange={(e) => setListUrl(e.target.value)}
                  className="w-full rounded-xl border border-line px-3.5 py-2 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>

              {scraperType === "html" && (
                <div className="rounded-xl border border-line bg-slate-50/50 p-4 space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase">
                    CSS Selector Config
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Item Selector
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="table tbody tr"
                        value={itemSelector}
                        onChange={(e) => setItemSelector(e.target.value)}
                        className="w-full rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Title Selector
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="td:nth-child(2) a"
                        value={titleSelector}
                        onChange={(e) => setTitleSelector(e.target.value)}
                        className="w-full rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Link Selector
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="td:nth-child(2) a"
                        value={linkSelector}
                        onChange={(e) => setLinkSelector(e.target.value)}
                        className="w-full rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Date Selector (optional)
                      </label>
                      <input
                        type="text"
                        placeholder="td:nth-child(3)"
                        value={dateSelector}
                        onChange={(e) => setDateSelector(e.target.value)}
                        className="w-full rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Fetch Interval (Minutes)
                  </label>
                  <input
                    type="number"
                    min={10}
                    value={fetchIntervalMinutes}
                    onChange={(e) => setFetchIntervalMinutes(Number(e.target.value))}
                    className="w-full rounded-xl border border-line px-3.5 py-2 text-sm focus:border-brand-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="isActiveCheck"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 text-brand-600 rounded border-line"
                  />
                  <label htmlFor="isActiveCheck" className="text-sm font-semibold text-slate-700">
                    Source Active in Scheduler
                  </label>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-line pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  disabled={runningAction === "save"}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={runningAction === "save"}
                  className="bg-brand-700 text-white hover:bg-brand-800"
                >
                  {runningAction === "save" ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                    </span>
                  ) : editingSource ? (
                    "Save Changes"
                  ) : (
                    "Create Source"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DRY RUN PREVIEW MODAL */}
      {testResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Dry Run Test Result: {testResult.sourceName}
                </h3>
              </div>
              <button
                onClick={() => setTestResult(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl text-xs font-semibold">
                <span>
                  Status:{" "}
                  {testResult.success ? (
                    <strong className="text-emerald-700">SUCCESS ({testResult.itemsFound} items parsed)</strong>
                  ) : (
                    <strong className="text-red-700">FAILED</strong>
                  )}
                </span>
                <span className="text-slate-500">Duration: {testResult.durationMs}ms</span>
              </div>

              {testResult.error && (
                <div className="p-3 rounded-xl bg-red-50 text-red-800 border border-red-200 text-xs">
                  {testResult.error}
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">
                  Preview of First 5 Parsed Items (Not saved to DB):
                </h4>
                {testResult.previewItems && testResult.previewItems.length > 0 ? (
                  <div className="space-y-2">
                    {testResult.previewItems.map((item, i) => (
                      <div key={i} className="p-3 rounded-xl border border-line bg-canvas/40 text-xs space-y-1">
                        <p className="font-bold text-slate-900">{item.title}</p>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-600 hover:underline flex items-center gap-1 line-clamp-1"
                        >
                          <ExternalLink className="h-3 w-3 shrink-0" />
                          {item.url}
                        </a>
                        {item.publishedAt && (
                          <p className="text-[11px] text-slate-500">
                            Parsed Date: {new Date(item.publishedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic p-4 text-center">
                    0 items parsed. Check selectors against HTML structure.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 text-right">
              <Button onClick={() => setTestResult(null)} variant="outline">
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
