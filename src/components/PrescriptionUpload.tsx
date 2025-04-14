import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Props {
  onUploadComplete: (url: string) => void;
  patientId: string;
}

export default function PrescriptionUpload({ onUploadComplete, patientId }: Props) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${patientId}/${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('prescriptions')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('prescriptions')
        .getPublicUrl(fileName);

      onUploadComplete(publicUrl);
    } catch (error) {
      console.error('Upload error:', error);
    }
  }, [patientId, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}
    >
      <input {...getInputProps()} />
      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
      {isDragActive ? (
        <p className="text-blue-500">Drop the prescription here</p>
      ) : (
        <div>
          <p className="text-gray-600">Drag & drop a prescription here, or click to select</p>
          <p className="text-sm text-gray-500 mt-2">Supported formats: JPEG, PNG, PDF</p>
        </div>
      )}
    </div>
  );
}