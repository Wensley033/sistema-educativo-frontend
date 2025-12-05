import { AlertCircle } from 'lucide-react';

export default function ErrorState({
  title = "Error al cargar datos",
  description = "Ocurrió un error inesperado",
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="rounded-full bg-red-50 p-6 mb-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-sm">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
