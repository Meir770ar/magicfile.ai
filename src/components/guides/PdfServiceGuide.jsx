import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function PdfServiceGuide() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl text-center">Guide to Setting Up PDF Processing Service</CardTitle>
        <CardDescription className="text-center">
          This guide explains how to set up a server-side image processing and PDF conversion service
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Using Accordion instead of Tabs to avoid potential issues */}
        <Accordion type="single" collapsible defaultValue="overview">
          <AccordionItem value="overview">
            <AccordionTrigger>Overview</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <h3 className="text-lg font-bold">Overview</h3>
              <p>To implement professional-grade image processing and PDF conversion capabilities, you need to set up a dedicated microservice to handle these processes. Here are the main steps:</p>
              
              <ol className="list-decimal ml-6 space-y-2">
                <li>
                  <strong>Set up a processing server:</strong> Develop a server service that receives images/files, processes them, and returns results
                </li>
                <li>
                  <strong>Choose technologies:</strong> Python is a great choice due to its powerful image processing libraries
                </li>
                <li>
                  <strong>Plan the API:</strong> Create endpoints for file uploads, processing, and conversion
                </li>
                <li>
                  <strong>Storage:</strong> System for storing original and processed files
                </li>
                <li>
                  <strong>Integration:</strong> Connect your application to the new service
                </li>
              </ol>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="backend">
            <AccordionTrigger>Backend</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <h3 className="text-lg font-bold">Python Backend Development</h3>
              <p>Here's a basic example of a Python server that handles image processing and PDF conversion:</p>

              <div className="bg-gray-800 text-gray-200 p-4 rounded-md overflow-x-auto text-left">
                <pre>{`
# Install required libraries
# pip install Flask Pillow PyPDF2 img2pdf reportlab

from flask import Flask, request, jsonify, send_file
from PIL import Image, ImageEnhance, ImageFilter
import io
import os
import uuid
import zipfile
import img2pdf
from reportlab.pdfgen import canvas
from werkzeug.utils import secure_filename

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
PROCESSED_FOLDER = 'processed'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    files = request.files.getlist('file')
    file_paths = []
    
    for file in files:
        if file.filename == '':
            continue
        
        filename = secure_filename(file.filename)
        file_id = str(uuid.uuid4())
        file_path = os.path.join(UPLOAD_FOLDER, f"{file_id}_{filename}")
        file.save(file_path)
        file_paths.append(file_path)
    
    return jsonify({
        'message': f'{len(file_paths)} files uploaded successfully',
        'file_ids': file_paths
    })

@app.route('/convert-to-pdf', methods=['POST'])
def convert_to_pdf():
    data = request.json
    file_paths = data.get('file_paths', [])
    output_filename = data.get('output_filename', 'output.pdf')
    
    if not file_paths:
        return jsonify({'error': 'No files provided'}), 400
    
    # Create output PDF file path
    output_path = os.path.join(PROCESSED_FOLDER, output_filename)
    
    # Convert images to PDF
    try:
        # For multiple images
        if len(file_paths) > 1:
            with open(output_path, "wb") as f:
                image_list = []
                for path in file_paths:
                    if path.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
                        image_list.append(path)
                
                if image_list:
                    f.write(img2pdf.convert(image_list))
        # For a single image
        elif len(file_paths) == 1 and file_paths[0].lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
            with open(output_path, "wb") as f:
                f.write(img2pdf.convert(file_paths[0]))
        else:
            return jsonify({'error': 'Unsupported file format'}), 400
        
        return jsonify({
            'message': 'PDF created successfully',
            'pdf_path': output_path,
            'download_url': f'/download/{os.path.basename(output_path)}'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    return send_file(os.path.join(PROCESSED_FOLDER, filename), as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)`}</pre>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="api">
            <AccordionTrigger>API Interface</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <h3 className="text-lg font-bold">API Design</h3>
              <p>Your PDF conversion service should expose the following API endpoints:</p>
              
              <ul className="space-y-4 mt-4">
                <li className="p-3 bg-gray-100 rounded-md">
                  <div className="font-mono text-sm font-bold text-blue-800">POST /upload</div>
                  <p className="mt-1 text-sm">Upload one or more files to the server</p>
                  <div className="mt-2 text-xs">
                    <strong>Request:</strong> Form data with 'file' field (can be multiple)
                  </div>
                  <div className="mt-1 text-xs">
                    <strong>Response:</strong> JSON with file paths and success message
                  </div>
                </li>
                
                <li className="p-3 bg-gray-100 rounded-md">
                  <div className="font-mono text-sm font-bold text-blue-800">POST /convert-to-pdf</div>
                  <p className="mt-1 text-sm">Convert uploaded images to PDF</p>
                  <div className="mt-2 text-xs">
                    <strong>Request:</strong> JSON with file_paths array and optional output_filename
                  </div>
                  <div className="mt-1 text-xs">
                    <strong>Response:</strong> JSON with PDF download URL
                  </div>
                </li>
                
                <li className="p-3 bg-gray-100 rounded-md">
                  <div className="font-mono text-sm font-bold text-blue-800">GET /download/:filename</div>
                  <p className="mt-1 text-sm">Download a processed file</p>
                  <div className="mt-2 text-xs">
                    <strong>Response:</strong> File download
                  </div>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="integration">
            <AccordionTrigger>Integration</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <h3 className="text-lg font-bold">Integrating with Your Application</h3>
              <p>Once your PDF service is running, integrate it with your application using these steps:</p>
              
              <ol className="list-decimal ml-6 space-y-2">
                <li>
                  <strong>Deploy the service:</strong> Host the Python service on a server (AWS, GCP, Azure, etc.)
                </li>
                <li>
                  <strong>Configure CORS:</strong> Make sure the service accepts requests from your application domain
                </li>
                <li>
                  <strong>Create a client library:</strong> Add API functions to your front-end to communicate with the service
                </li>
                <li>
                  <strong>Handle file uploads:</strong> Modify your application to send files to the new service
                </li>
                <li>
                  <strong>Display results:</strong> Show processing results and downloaded files to the user
                </li>
              </ol>
              
              <div className="mt-4 p-4 bg-blue-50 text-blue-700 rounded-md">
                <h4 className="font-bold">For MagicFile.ai</h4>
                <p className="mt-2 text-sm">
                  To integrate this service with your MagicFile.ai application, you would:
                </p>
                <ul className="list-disc ml-6 mt-2 text-sm space-y-1">
                  <li>Deploy this Python service on a cloud provider</li>
                  <li>Update your PdfConverter component to send files to this service</li>
                  <li>Use the returned URLs to offer users download options</li>
                  <li>Store processed document references in your Document entity</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}