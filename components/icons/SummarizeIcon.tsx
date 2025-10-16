
import React from 'react';

export const SummarizeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18"></path>
    <path d="M16 7h-4"></path>
    <path d="M16 12h-4"></path>
    <path d="M8 7h4"></path>
    <path d="M8 12h4"></path>
    <path d="M8 17h4"></path>
  </svg>
);
