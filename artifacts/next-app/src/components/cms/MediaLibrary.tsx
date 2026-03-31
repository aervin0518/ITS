"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Upload, Trash2, Copy, Check, Search, FileText, FileImage,
  FileVideo, File, Download, RefreshCw, X, Loader2
} from "lucide-react";

interface MediaFile {
  name: string;
  path: string;
  size: number;
  mimeType: string;
  createdAt: string;
  url: string | null;
}

function fileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return <FileImage size={20} className="text-blue-500" />;
  if (mimeType.startsWith("video/")) return <FileVideo size={20} className="text-purple-500" />;
  if (mimeType === "application/pdf") return <FileText size={20} className="text-red-500" />;
  return <File size={20} className="text-gray-400" />;
}

function formatSize(bytes: number) {
  if (bytes === 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const ACCEPT = "image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,video/*,.mp4,.mov,.avi";

export default function MediaLibrary({ userId }: { userId: string }) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [deletingPath, setDeletingPath] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cms/storage/list?bucket=media");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setFiles(data.files ?? []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function uploadFile(file: File) {
    setUploading(true);
    setUploadProgress(`Uploading ${file.name}…`);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("bucket", "media");
      const res = await fetch("/api/cms/storage/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      await load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  }

  async function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    for (const f of Array.from(fileList)) {
      await uploadFile(f);
    }
  }

  async function deleteFile(path: string) {
    setDeletingPath(path);
    try {
      const res = await fetch(`/api/cms/storage/delete?bucket=media&path=${encodeURIComponent(path)}`, { method: "DELETE" });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setFiles((prev) => prev.filter((f) => f.path !== path));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setDeletingPath(null);
    }
  }

  function copyUrl(url: string, path: string) {
    navigator.clipboard.writeText(url);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  }

  const filtered = files.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
            <FileImage size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#111114]">Media Library</h1>
            <p className="text-sm text-gray-500">Upload and manage images, PDFs, documents, and videos.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="p-2 rounded-lg text-gray-400 hover:text-[#111114] hover:bg-gray-100 transition" title="Refresh">
            <RefreshCw size={16} />
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 bg-[#152A4A] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-[#1E3A5F] transition disabled:opacity-60"
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {uploading ? "Uploading…" : "Upload Files"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={ACCEPT}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      </div>

      {/* Drag & drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        className={`border-2 border-dashed rounded-xl p-8 text-center mb-6 transition-colors cursor-pointer ${
          dragging ? "border-[#C8963E] bg-amber-50" : "border-gray-200 hover:border-gray-300"
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={28} className={`mx-auto mb-2 ${dragging ? "text-[#C8963E]" : "text-gray-300"}`} />
        {uploading ? (
          <p className="text-sm text-[#C8963E] font-medium">{uploadProgress}</p>
        ) : (
          <>
            <p className="text-sm font-medium text-gray-500">Drag files here or click to browse</p>
            <p className="text-xs text-gray-400 mt-1">Images, PDFs, documents, videos — up to 100MB each</p>
          </>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center justify-between mb-4">
          <p className="text-red-700 text-sm">{error}</p>
          <button onClick={() => setError(null)}><X size={14} className="text-red-400" /></button>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search files…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A]"
        />
      </div>

      {/* File list */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">
          <Loader2 size={32} className="mx-auto animate-spin mb-3 text-gray-300" />
          <p className="text-sm">Loading files…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-100">
          <FileImage size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="font-medium text-gray-500">{search ? "No files match your search" : "No files yet"}</p>
          <p className="text-sm mt-1">Upload images, PDFs, documents, or videos above.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-0 text-xs font-semibold uppercase tracking-wider text-gray-400 px-5 py-3 border-b border-gray-100">
            <span className="w-8" />
            <span>Name</span>
            <span className="w-20 text-right">Size</span>
            <span className="w-28 text-right">Uploaded</span>
            <span className="w-20 text-right">Actions</span>
          </div>
          {filtered.map((file) => (
            <div key={file.path} className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-0 items-center px-5 py-3.5 border-b border-gray-50 hover:bg-gray-50 transition">
              <span className="w-8">{fileIcon(file.mimeType)}</span>
              <div className="min-w-0 pr-4">
                <p className="text-sm font-medium text-[#111114] truncate">{file.name.split("-").slice(1).join("-") || file.name}</p>
                <p className="text-xs text-gray-400 truncate">{file.mimeType || "unknown"}</p>
              </div>
              <span className="w-20 text-right text-sm text-gray-500">{formatSize(file.size)}</span>
              <span className="w-28 text-right text-xs text-gray-400">{file.createdAt ? formatDate(file.createdAt) : "—"}</span>
              <div className="w-20 flex items-center justify-end gap-1">
                {file.url && (
                  <button
                    onClick={() => file.url && copyUrl(file.url, file.path)}
                    title="Copy URL"
                    className="p-1.5 rounded text-gray-400 hover:text-[#152A4A] hover:bg-gray-100 transition"
                  >
                    {copiedPath === file.path ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  </button>
                )}
                {file.url && (
                  <a href={file.url} download target="_blank" rel="noreferrer"
                    className="p-1.5 rounded text-gray-400 hover:text-[#152A4A] hover:bg-gray-100 transition"
                    title="Download"
                  >
                    <Download size={14} />
                  </a>
                )}
                <button
                  onClick={() => deleteFile(file.path)}
                  disabled={deletingPath === file.path}
                  title="Delete"
                  className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                >
                  {deletingPath === file.path ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-3 text-right">{filtered.length} file{filtered.length !== 1 ? "s" : ""}</p>
    </div>
  );
}
