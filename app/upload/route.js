import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

// アップロード設定
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

// アップロードディレクトリが存在しない場合は作成
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export async function POST(request) {
  try {
    // FormDataを取得
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ 
        error: 'ファイルがアップロードされませんでした' 
      }, { status: 400 });
    }

    // ファイル検証
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: 'ファイルサイズが大きすぎます。10MB以下のファイルをアップロードしてください。' 
      }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        error: '対応していないファイル形式です。PDF、TXT、DOC、DOCXファイルをアップロードしてください。' 
      }, { status: 400 });
    }

    // ファイルを保存
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ファイル名を安全な形式に変更
    const timestamp = Date.now();
    const sanitizedFileName = file.name
      .replace(/[^a-zA-Z0-9.\-_]/g, '_')
      .toLowerCase();
    
    const newFileName = `${timestamp}_${sanitizedFileName}`;
    const filePath = path.join(UPLOAD_DIR, newFileName);

    // ファイル保存
    fs.writeFileSync(filePath, buffer);

    // ファイル情報を取得
    const fileStats = fs.statSync(filePath);

    // 成功レスポンス
    const response = {
      success: true,
      fileId: timestamp.toString(),
      originalName: file.name,
      fileName: newFileName,
      size: fileStats.size,
      type: file.type,
      uploadTime: new Date().toISOString(),
      message: 'ファイルが正常にアップロードされました'
    };

    // ファイル処理ログ
    console.log('File uploaded:', {
      originalName: file.name,
      size: fileStats.size,
      type: file.type,
      uploadTime: response.uploadTime
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('Upload error:', error);
    
    return NextResponse.json({ 
      error: 'ファイルアップロード中にエラーが発生しました' 
    }, { status: 500 });
  }
}
