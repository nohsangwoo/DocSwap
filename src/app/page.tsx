'use client'

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [convertTo, setConvertTo] = useState<string>('');
  const [convertedFileUrl, setConvertedFileUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleConvert = async () => {
    if (!file || !convertTo) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('convertTo', convertTo);

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setConvertedFileUrl(url);
      } else {
        console.error('변환 실패');
      }
    } catch (error) {
      console.error('에러 발생:', error);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-2xl font-bold">파일 변환기</h1>
      <div className="flex flex-col items-center gap-4">
        <input type="file" onChange={handleFileChange} />
        <select
          value={convertTo}
          onChange={(e) => setConvertTo(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">변환할 형식 선택</option>
          <option value="pdf">PDF</option>
          <option value="docx">DOCX</option>
          <option value="hwp">HWP</option>
        </select>
        <button
          onClick={handleConvert}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          변환하기
        </button>
        {convertedFileUrl && (
          <a
            href={convertedFileUrl}
            download
            className="text-blue-500 hover:underline"
          >
            변환된 파일 다운로드
          </a>
        )}
      </div>
    </div>
  );
}
