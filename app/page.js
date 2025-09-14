'use client';

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError(null);
    setUploadResult(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('ファイルを選択してください');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadResult(result);
        setFile(null);
        // ファイル入力をリセット
        const fileInput = document.getElementById('fileInput');
        if (fileInput) fileInput.value = '';
      } else {
        setError(result.error || 'アップロードに失敗しました');
      }
    } catch (err) {
      setError('ネットワークエラーが発生しました');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Patent<span className="text-blue-600">Lens</span>
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            AI特許文献精読サポートシステム
          </p>
          <p className="text-gray-500">
            特許文献をアップロードして、AIによる詳細分析を受けましょう
          </p>
        </div>

        {/* メインコンテンツ */}
        <div className="max-w-4xl mx-auto">
          {/* アップロードカード */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              特許文献アップロード
            </h2>
            
            {/* ファイル選択エリア */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <div className="space-y-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                
                <div>
                  <input
                    id="fileInput"
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.txt,.doc,.docx"
                    className="hidden"
                  />
                  <label
                    htmlFor="fileInput"
                    className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                  >
                    ファイルを選択
                  </label>
                  <span className="text-gray-500"> またはドラッグ&ドロップ</span>
                </div>
                
                <p className="text-sm text-gray-500">
                  対応形式: PDF, TXT, DOC, DOCX (最大 10MB)
                </p>
              </div>
            </div>

            {/* 選択されたファイル情報 */}
            {file && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.size)} • {file.type || '不明な形式'}
                    </p>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* エラー表示 */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-800">{error}</p>
                </div>
              </div>
            )}

            {/* アップロードボタン */}
            <div className="mt-6">
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  !file || uploading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {uploading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    アップロード中...
                  </div>
                ) : (
                  '分析を開始'
                )}
              </button>
            </div>
          </div>

          {/* アップロード結果 */}
          {uploadResult && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                アップロード完了
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">ファイル名:</span>
                  <span className="font-medium">{uploadResult.originalName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ファイルサイズ:</span>
                  <span className="font-medium">{formatFileSize(uploadResult.size)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">アップロード時刻:</span>
                  <span className="font-medium">{new Date(uploadResult.uploadTime).toLocaleString('ja-JP')}</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-green-800">
                    ファイルが正常にアップロードされました。AI分析を準備中です...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 機能紹介 */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">文書解析</h3>
              <p className="text-gray-600 text-sm">
                特許文献の構造を自動解析し、重要な技術要素を抽出します
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI解析</h3>
              <p className="text-gray-600 text-sm">
                最新のAI技術で特許の新規性や進歩性を分析・評価します
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">詳細レポート</h3>
              <p className="text-gray-600 text-sm">
                分析結果を分かりやすいレポート形式で提供します
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
