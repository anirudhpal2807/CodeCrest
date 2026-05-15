import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ICON_MAP = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const STYLE_MAP = {
  success: {
    bg: 'rgba(34, 197, 94, 0.12)',
    border: 'rgba(34, 197, 94, 0.3)',
    icon: '#22c55e',
    bar: '#22c55e',
  },
  error: {
    bg: 'rgba(239, 68, 68, 0.12)',
    border: 'rgba(239, 68, 68, 0.3)',
    icon: '#ef4444',
    bar: '#ef4444',
  },
  warning: {
    bg: 'rgba(234, 179, 8, 0.12)',
    border: 'rgba(234, 179, 8, 0.3)',
    icon: '#eab308',
    bar: '#eab308',
  },
  info: {
    bg: 'rgba(99, 102, 241, 0.12)',
    border: 'rgba(99, 102, 241, 0.3)',
    icon: '#6366f1',
    bar: '#6366f1',
  },
};

function Toast({ message, type = 'success', duration = 3000, onClose }) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  const style = STYLE_MAP[type] || STYLE_MAP.success;
  const Icon = ICON_MAP[type] || ICON_MAP.success;

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));

    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onClose?.(), 350);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(() => onClose?.(), 350);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 24,
        right: 24,
        zIndex: 9999,
        pointerEvents: 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
          padding: '16px 20px',
          minWidth: 320,
          maxWidth: 440,
          background: style.bg,
          backdropFilter: 'blur(20px) saturate(180%)',
          border: `1px solid ${style.border}`,
          borderRadius: 14,
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4), 0 4px 12px rgba(0, 0, 0, 0.2)',
          transform: visible && !exiting ? 'translateX(0)' : 'translateX(120%)',
          opacity: visible && !exiting ? 1 : 0,
          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: 3,
            background: style.bar,
            borderRadius: '0 0 14px 14px',
            animation: visible && !exiting ? `toast-progress ${duration}ms linear forwards` : 'none',
          }}
        />

        <Icon
          size={20}
          style={{ color: style.icon, flexShrink: 0, marginTop: 2 }}
        />

        <p
          style={{
            flex: 1,
            margin: 0,
            fontSize: 14,
            fontWeight: 500,
            lineHeight: 1.5,
            color: '#f1f5f9',
            fontFamily: '"Inter", system-ui, sans-serif',
          }}
        >
          {message}
        </p>

        <button
          onClick={handleDismiss}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
            borderRadius: 6,
            color: '#64748b',
            display: 'flex',
            flexShrink: 0,
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#94a3b8')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
        >
          <X size={16} />
        </button>

        <style>{`
          @keyframes toast-progress {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}</style>
      </div>
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success', duration = 3000) => {
    setToast({ message, type, duration, key: Date.now() });
  };

  const ToastContainer = () =>
    toast ? (
      <Toast
        key={toast.key}
        message={toast.message}
        type={toast.type}
        duration={toast.duration}
        onClose={() => setToast(null)}
      />
    ) : null;

  return { showToast, ToastContainer };
}

export default Toast;
