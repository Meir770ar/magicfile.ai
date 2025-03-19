import React from 'react';
import PdfServiceGuide from '../components/guides/PdfServiceGuide';

export default function PdfGuidePage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-white">PDF Conversion Service Setup Guide</h1>
      <div className="text-white/80 mb-8">
        <p>This guide provides instructions for setting up a dedicated service to handle PDF conversion and image processing tasks for MagicFile.ai.</p>
      </div>
      <PdfServiceGuide />
    </div>
  );
}