// 芯颜 AI UploadSection — 图片上传与预览
// 支持拖拽上传、点击上传、预览、分析触发

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
    if (!file.type.startsWith('image/')) {
      return '请上传图片文件（JPG、PNG、WebP 格式）';
    }
    if (file.size > 10 * 1024 * 1024) {
      return '图片大小不能超过 10MB';
    }
    return null;
  };

  const handleFile = useCallback((file: File) => {
    const err = validateFile(file);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !previewUrl) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeSkin(selectedFile);
      onAnalysisComplete(result, previewUrl);
    } catch (err) {
      setError('分析失败，请重试');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section id="upload" className="py-24 bg-[#F5F2EE]">
      {isAnalyzing && <AnalyzingOverlay />}

      <div className="max-w-3xl mx-auto px-6">
        {/* 标题 */}
        <div className="text-center mb-12">
          <p className="font-sans-sc text-sm text-[#1C3A2E] tracking-widest uppercase mb-3">
            开始检测
          </p>
          <h2 className="font-serif-sc text-4xl font-bold text-[#1A1A1A] mb-4">
            上传你的
            <span className="text-[#1C3A2E]"> 脸部照片</span>
          </h2>
          <p className="font-sans-sc text-[#6A6A6A] text-base">
            建议使用正面、光线充足、无遮挡的照片，分析效果更准确
          </p>
          <div className="divider-gold w-24 mx-auto mt-6" />
        </div>

        {/* 上传区域 */}
        <div className="bg-white rounded-3xl shadow-lg shadow-[#1C3A2E]/5 p-8 border border-[#F0EDE8]">
          {!previewUrl ? (
            /* 拖拽上传区 */
            <div
              className={`upload-zone rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                isDragOver ? 'drag-over' : ''
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleInputChange}
              />

              <div className="flex flex-col items-center gap-4">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isDragOver
                      ? 'bg-[#1C3A2E] scale-110'
                      : 'bg-[#E8F0EC]'
                  }`}
                >
                  <Upload
                    className={`w-8 h-8 transition-colors ${
                      isDragOver ? 'text-white' : 'text-[#1C3A2E]'
                    }`}
                  />
                </div>

                <div>
                  <p className="font-serif-sc text-lg font-semibold text-[#1A1A1A] mb-1">
                    {isDragOver ? '松开即可上传' : '拖拽照片到此处'}
                  </p>
                  <p className="font-sans-sc text-sm text-[#8A8A8A]">
                    或者{' '}
                    <span className="text-[#1C3A2E] font-medium underline underline-offset-2">
                      点击选择文件
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-xs text-[#8A8A8A]">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span className="font-sans-sc">JPG / PNG / WebP</span>
                  </div>
                  <div className="w-px h-3 bg-[#E0DDD8]" />
                  <div className="flex items-center gap-1.5 text-xs text-[#8A8A8A]">
                    <Camera className="w-3.5 h-3.5" />
                    <span className="font-sans-sc">最大 10MB</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* 预览区 */
            <div className="space-y-6">
              <div className="relative rounded-2xl overflow-hidden bg-[#F5F2EE]">
                <img
                  src={previewUrl}
                  alt="上传的照片预览"
                  className="w-full max-h-80 object-contain"
                />
                <button
                  onClick={handleRemove}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
                {/* 扫描线动画 */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#1C3A2E]/60 to-transparent scan-animation" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#E8F0EC] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#1C3A2E]/10 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-[#1C3A2E]" />
                  </div>
                  <div>
                    <p className="font-sans-sc text-sm font-medium text-[#1A1A1A]">
                      {selectedFile?.name}
                    </p>
                    <p className="font-sans-sc text-xs text-[#8A8A8A]">
                      {selectedFile ? (selectedFile.size / 1024).toFixed(1) + ' KB' : ''}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRemove}
                  className="text-xs text-[#8A8A8A] hover:text-red-500 font-sans-sc transition-colors"
                >
                  重新选择
                </button>
              </div>
            </div>
          )}

          {/* 错误提示 */}
          {error && (
            <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-100">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="font-sans-sc text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* 分析按钮 */}
          {previewUrl && !error && (
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full mt-6 bg-[#1C3A2E] text-[#FAF8F5] font-sans-sc font-medium py-4 rounded-2xl hover:bg-[#2A5040] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:shadow-[#1C3A2E]/20 flex items-center justify-center gap-2 text-base"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  AI 分析中...
                </>
              ) : (
                <>
                  <span>开始 AI 皮肤检测</span>
                  <span className="text-[#C9956A]">→</span>
                </>
              )}
            </button>
          )}

          {/* 隐私说明 */}
          <p className="font-sans-sc text-xs text-[#A0A0A0] text-center mt-4">
            🔒 您的照片仅用于本次分析，分析完成后立即删除，我们不会存储任何个人图像
          </p>
        </div>

        {/* 拍照建议 */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          {[
            { emoji: '☀️', title: '光线充足', desc: '自然光或室内明亮环境' },
            { emoji: '📸', title: '正面角度', desc: '面对摄像头，保持水平' },
            { emoji: '🚫', title: '避免遮挡', desc: '去除口罩、刘海等遮挡' },
          ].map(({ emoji, title, desc }) => (
            <div key={title} className="text-center p-4 bg-white rounded-2xl border border-[#F0EDE8]">
              <div className="text-2xl mb-2">{emoji}</div>
              <div className="font-serif-sc text-sm font-semibold text-[#1A1A1A] mb-1">{title}</div>
              <div className="font-sans-sc text-xs text-[#8A8A8A]">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
