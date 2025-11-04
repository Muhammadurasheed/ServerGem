import React from 'react';

export const SendIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);

export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
  </svg>
);

export const AiSparkleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        {...props}>
            <path d="M9.5 2.5a2.5 2.5 0 0 1 5 0"/>
            <path d="M6.2 5a4 4 0 0 1 11.6 0"/>
            <path d="M5 11a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1"/>
            <path d="M19 11a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1"/>
            <path d="M10 17a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1"/>
            <path d="M14 17a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1"/>
            <path d="M12 2v2"/>
            <path d="M12 10v1"/>
            <path d="M12 16v1"/>
            <path d="m4.929 4.929 1.414 1.414"/>
            <path d="m17.657 4.929 1.414-1.414"/>
            <path d="m4.929 17.657 1.414-1.414"/>
            <path d="m17.657 17.657 1.414 1.414"/>
            <path d="M2 12h2"/>
            <path d="M10 12h1"/>
            <path d="M13 12h1"/>
            <path d="M20 12h2"/>
    </svg>
);
