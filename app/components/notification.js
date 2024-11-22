import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dynamic from 'next/dynamic';

const ToastContainerDynamic = dynamic(
  () => import('react-toastify').then((mod) => mod.ToastContainer),
  { ssr: false }
);

// Componente principal de notificación
export default function Notification() {
  return (
    <ToastContainerDynamic
      position="top-right"
      autoClose={3000}
      hideProgressBar
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      toastClassName="rounded-lg px-4 py-3 text-sm font-medium shadow-lg border"
    />
  );
}
// Notificaciones con estilo personalizado
export const notifySuccess = (message) =>
  toast.success(message, {className: '!bg-green-100 !text-green-800 !border-l-4 !border-green-800 !font-medium',});

export const notifyError = (message) =>
  toast.error(message, {className: '!bg-red-100 !text-red-800 !border-l-4 !border-red-500 !font-medium',});

export const notifyInfo = (message) =>
  toast.info(message, {className: 'bg-blue-100 text-blue-800 border-l-4 border-blue-500',});

export const notifyWarning = (message) =>
  toast.warn(message, {className: 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500',});
