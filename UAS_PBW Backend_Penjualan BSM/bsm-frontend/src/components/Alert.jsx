const variantClasses = {
  success: 'bg-emerald-900/70 border-emerald-500 text-emerald-100',
  error: 'bg-red-900/70 border-red-500 text-red-100',
  info: 'bg-slate-800/80 border-slate-500 text-slate-100',
};

const Alert = ({ message, type = 'info', onClose }) => {
  if (!message) return null;
  return (
    <div
      className={`mb-3 px-3 py-2 rounded-md border text-xs flex justify-between gap-3 ${variantClasses[type]}`}
    >
      <div className="whitespace-pre-line">{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="font-semibold text-xs opacity-80 hover:opacity-100"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default Alert;
