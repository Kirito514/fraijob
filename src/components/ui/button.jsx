// src/components/ui/button.jsx

export function Button({ children, className = '', type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={`px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
