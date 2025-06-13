import { useCallback } from 'react';
import { Upload, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { formatFileSize } from '@/utils/formatters/fileFormatter';

interface FileUploadZoneProps {
  
  files: File[];
  onFilesAdd: (newFiles: File[]) => void;
  onFileRemove: (index: number) => void;
  accept: string;
  error?: string;
}

const normalizeFileName = (fileName: string): string => {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/gi, "n");
};

export function FileUploadZone({  files, onFilesAdd, onFileRemove, accept, error }: FileUploadZoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const normalizedFiles = acceptedFiles.map(file => {
      const normalizedName = normalizeFileName(file.name);
      return new File([file], normalizedName, { type: file.type });
    });
    onFilesAdd(normalizedFiles);
  }, [onFilesAdd]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.split(',').reduce((acc, curr) => {
      acc[curr] = [];
      return acc;
    }, {} as Record<string, string[]>)
  });

  return (
    <div className="space-y-4">
   
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${error ? 'border-red-500' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive ? (
            'Suelta los archivos aquí...'
          ) : (
            <>
              Arrastra y suelta archivos aquí o <span className="text-blue-500">haz clic para seleccionar</span>
              <br />
              <span className="text-xs text-gray-500">
                PDF, Word, Excel o imágenes (Nombre de archivo sin espacios y máx. 10MB por archivo)
               
              </span>
            </>
          )}
        </p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file, index) => (
            <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span>{file.name}</span>
                <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
              </div>
              <button
                type="button"
                onClick={() => onFileRemove(index)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={18} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}