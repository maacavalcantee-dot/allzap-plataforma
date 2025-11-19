
import React from 'react';

export const PlatformIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    {/* Grid Layout representing "Platform/Management" */}
    
    {/* Top Left: Dashboard/Data Block */}
    <rect x="3" y="3" width="7" height="7" rx="2" />
    
    {/* Bottom Left: Users/Workflow Block */}
    <rect x="3" y="14" width="7" height="7" rx="2" opacity="0.7" />
    
    {/* Bottom Right: Settings/Reports Block */}
    <rect x="14" y="14" width="7" height="7" rx="2" opacity="0.7" />
    
    {/* Top Right: Communication/Chat (The Focus) */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4a2 2 0 0 1 2-2h4.5a2 2 0 0 1 2 2v4.5a2 2 0 0 1-2 2h-1l-2.5 2.5V10.5h-1a2 2 0 0 1-2-2V4Z" />
  </svg>
);
