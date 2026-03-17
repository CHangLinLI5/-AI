// 芯颜 AI UploadSection v3 — 全屏分页式
// 暖灰底 | 白色卡片 | 砖赭红强调

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Camera, ImageIcon, AlertCircle } from 'lucide-react';
import { analyzeSkin, type SkinAnalysisResult } from '@/lib/skinAnalysis';
import AnalyzingOverlay from './AnalyzingOverlay';

interface UploadSectionProps {
  onAnalysisComplete: (result: SkinAnalysisResult, imageUrl: string) => void;
}

export default function UploadSection({ onAnalysisComplete }: UploadSectionProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('image/')) return '请上传图片文件（JPG、PNG、WebP 格式）';
    if (file.size > 10 * 1024 * 1024) return '图片大小不能超过 10MB';
    return null;
  };

  const handleFile = useCallback((file: File) => {
    const err = validateFile(file);
    if (err) { setError(err); return; }
    setError(null);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleRemove = () => {
    setPreviewUrl(null); setSelectedFile(null); setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !previewUrl) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeSkin(selectedFile);
      onAnalysisComplete(result, previewUrl);
    } catch {
      setError('分析失败，请重试');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section id="upload" className="w-full h-full bg-[#EFEDE9] overflow-y-auto">
      {isAnalyzing && <AnalyzingOverlay />}

      <div className="max-w-2xl mx-auto px-8 py-12">
        {/* 标题 */}
        <div className="mb-8">
          <p className="font-sans-sc text-xs text-[#B85C38] tracking-[0.2em] uppercase mb-4">开始检测</p>
          <h2 className="font-serif-sc text-4xl font-bold text-[#1A1A1A] leading-tight">
            上传你的脸部照片
          </h2>
          <p className="font-sans-sc text-[#6B6B6B] text-sm mt-3 leading-relaxed">
            建议使用正面、光线充足、无遮挡的照片，分析效果更准确
          </p>
          <div className="divider-accent w-16 mt-6" />
        </div>

        {/* 上传卡片 */}
        <div className="bg-white rounded-xl border border-[#E4E2DF] p-8">
          {!previewUrl ? (
            <div
              className={`upload-zone rounded-lg p-14 text-center cursor-pointer ${isDragOver ? 'drag-over' : ''}`}
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onClick={() => fileInputRef.current?.click()}
            >
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              <div className="flex flex-col items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-250 ${isDragOver ? 'bg-[#B85C38]' : 'bg-[#F2E8E3]'}`}>
                  <Upload className={`w-7 h-7 transition-colors ${isDragOver ? 'text-white' : 'text-[#B85C38]'}`} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-serif-sc text-base font-semibold text-[#1A1A1A] mb-1">
                    {isDragOver ? '松开即可上传' : '拖拽照片到此处'}
                  </p>
                  <p className="font-sans-sc text-sm text-[#8A8A8A]">
                    或 <span className="text-[#B85C38] underline underline-offset-2">点击选择文件</span>
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-[#8A8A8A]">
                  <span className="flex items-center gap-1.5 font-sans-sc"><ImageIcon className="w-3.5 h-3.5" />JPG / PNG / WebP</span>
                  <span className="w-px h-3 bg-[#E4E2DF]" />
                  <span className="flex items-center gap-1.5 font-sans-sc"><Camera className="w-3.5 h-3.5" />最大 10MB</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="relative rounded-lg overflow-hidden bg-[#F7F6F4]">
                <img src={previewUrl} alt="预览" className="w-full max-h-72 object-contain" />
                <button onClick={handleRemove} className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors">
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#B85C38]/50 to-transparent scan-animation" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-[#F2E8E3] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#B85C38]/10 flex items-center justify-center">
                    <ImageIcon className="w-4 h-4 text-[#B85C38]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-sans-sc text-sm font-medium text-[#1A1A1A]">{selectedFile?.name}</p>
                    <p className="font-sans-sc text-xs text-[#8A8A8A]">{selectedFile ? (selectedFile.size / 1024).toFixed(1) + ' KB' : ''}</p>
                  </div>
                </div>
                <button onClick={handleRemove} className="font-sans-sc text-xs text-[#8A8A8A] hover:text-red-500 transition-colors">重新选择</button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-100">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="font-sans-sc text-sm text-red-600">{error}</p>
            </div>
          )}

          {previewUrl && !error && (
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full mt-6 bg-[#1A1A1A] text-[#F7F6F4] font-sans-sc text-sm py-4 rounded-sm hover:bg-[#B85C38] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-250 flex items-center justify-center gap-2 tracking-wide"
            >
              {isAnalyzing ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />AI 分析中...</>
              ) : (
                <>开始 AI 皮肤检测 <span className="text-[#B85C38] group-hover:text-white">→</span></>
              )}
            </button>
          )}

          <p className="font-sans-sc text-xs text-[#A0A0A0] text-center mt-4">
            您的照片仅用于本次分析，分析完成后立即删除，不会存储任何个人图像
          </p>
        </div>

        {/* 拍照建议 */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {[
            { emoji: '☀️', title: '光线充足', desc: '自然光或室内明亮环境' },
            { emoji: '📸', title: '正面角度', desc: '面对摄像头，保持水平' },
            { emoji: '🚫', title: '避免遮挡', desc: '去除口罩、刘海等遮挡' },
          ].map(({ emoji, title, desc }) => (
            <div key={title} className="text-center p-4 bg-white rounded-xl border border-[#E4E2DF]">
              <div className="text-xl mb-2">{emoji}</div>
              <div className="font-serif-sc text-xs font-semibold text-[#1A1A1A] mb-1">{title}</div>
              <div className="font-sans-sc text-xs text-[#8A8A8A]">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
