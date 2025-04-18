import React from 'react';

// Define the props for the ErrorMessage component
interface ErrorMessageProps {
  message: string; // The error message to display
  onClose?: () => void; // Optional callback to close/hide the error message
  className?: string; // Optional custom class for styling
}

// ErrorMessage Component
const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onClose,
  className = '',
}) => {
  return (
    <div
      className={`bg-red-100 border border-red-400 text-red-600 px-4 py-3 rounded relative flex items-center justify-between ${className}`}
      role="alert"
    >
      <span className="block sm:inline font-medium">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-red-700 hover:text-red-900 focus:outline-none"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;