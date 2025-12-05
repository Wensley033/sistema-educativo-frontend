import { FileX } from 'lucide-react';

export default function EmptyState({
  title = "No hay datos",
  description = "No se encontraron resultados",
  action,
  icon: Icon = FileX
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="rounded-full bg-gray-100 p-6 mb-4">
        <Icon className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-sm">{description}</p>
      {action && action}
    </div>
  );
}
