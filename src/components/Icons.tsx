import React from "react";

// 工具/材料 SVG 图标（自定义设计 + 配色统一）

export const PrinterIcon: React.FC<{ size?: number; color?: string }> = ({ size = 120, color = "#FFD400" }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
    <rect x="15" y="30" width="90" height="55" rx="6" stroke={color} strokeWidth="3" fill="#1a1a2e" />
    <rect x="25" y="40" width="70" height="35" stroke={color} strokeWidth="2" fill="#0f1018" />
    <rect x="35" y="20" width="50" height="12" rx="2" stroke={color} strokeWidth="3" fill="#1a1a2e" />
    <line x1="60" y1="20" x2="60" y2="44" stroke={color} strokeWidth="3" />
    <rect x="50" y="44" width="20" height="10" rx="2" fill={color} />
    <circle cx="95" cy="78" r="3" fill={color} />
    <rect x="20" y="88" width="80" height="6" rx="2" fill={color} />
  </svg>
);

export const FilamentIcon: React.FC<{ size?: number; color?: string }> = ({ size = 120, color = "#FFD400" }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
    <ellipse cx="60" cy="40" rx="42" ry="14" stroke={color} strokeWidth="3" fill="#1a1a2e" />
    <ellipse cx="60" cy="60" rx="42" ry="14" stroke={color} strokeWidth="3" fill="#1a1a2e" />
    <ellipse cx="60" cy="80" rx="42" ry="14" stroke={color} strokeWidth="3" fill="#1a1a2e" />
    <line x1="18" y1="40" x2="18" y2="80" stroke={color} strokeWidth="2" />
    <line x1="102" y1="40" x2="102" y2="80" stroke={color} strokeWidth="2" />
    <path d="M 60 50 Q 80 55 60 60 Q 40 65 60 70" stroke={color} strokeWidth="2" fill="none" />
    <circle cx="60" cy="60" r="6" fill={color} />
  </svg>
);

export const ArduinoIcon: React.FC<{ size?: number; color?: string }> = ({ size = 120, color = "#FFD400" }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
    <rect x="15" y="30" width="90" height="60" rx="4" stroke={color} strokeWidth="3" fill="#0066cc" />
    <rect x="25" y="42" width="30" height="14" rx="2" stroke={color} strokeWidth="2" fill="#1a1a2e" />
    <circle cx="40" cy="49" r="2" fill={color} />
    <rect x="65" y="38" width="6" height="20" fill={color} />
    <rect x="73" y="38" width="6" height="20" fill={color} />
    <rect x="81" y="38" width="6" height="20" fill={color} />
    <rect x="89" y="38" width="6" height="20" fill={color} />
    <rect x="25" y="65" width="70" height="20" rx="2" fill="#0f1018" />
    {Array.from({ length: 14 }).map((_, i) => (
      <rect key={i} x={27 + i * 5} y={68} width="3" height="14" fill={color} />
    ))}
  </svg>
);

export const ServoIcon: React.FC<{ size?: number; color?: string }> = ({ size = 120, color = "#FFD400" }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
    <rect x="20" y="35" width="80" height="50" rx="6" stroke={color} strokeWidth="3" fill="#1a1a2e" />
    <circle cx="60" cy="60" r="18" stroke={color} strokeWidth="3" fill="#0f1018" />
    <circle cx="60" cy="60" r="6" fill={color} />
    <line x1="60" y1="42" x2="60" y2="20" stroke={color} strokeWidth="4" />
    <circle cx="60" cy="20" r="5" fill={color} />
    <line x1="35" y1="95" x2="35" y2="105" stroke={color} strokeWidth="3" />
    <line x1="55" y1="95" x2="55" y2="105" stroke={color} strokeWidth="3" />
    <line x1="75" y1="95" x2="75" y2="105" stroke={color} strokeWidth="3" />
  </svg>
);

export const UsbIcon: React.FC<{ size?: number; color?: string }> = ({ size = 120, color = "#FFD400" }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
    <rect x="40" y="20" width="40" height="20" rx="3" stroke={color} strokeWidth="3" fill="#1a1a2e" />
    <rect x="45" y="25" width="30" height="10" fill={color} />
    <path d="M 60 40 Q 35 55 60 70 Q 85 85 60 100" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" />
    <rect x="48" y="95" width="24" height="10" rx="2" stroke={color} strokeWidth="3" fill="#1a1a2e" />
  </svg>
);

export const BoltIcon: React.FC<{ size?: number; color?: string }> = ({ size = 120, color = "#FFD400" }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
    <path d="M 65 10 L 30 65 L 55 65 L 45 110 L 90 45 L 60 45 L 65 10 Z" fill={color} stroke="#000" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

export const HeartIcon: React.FC<{ size?: number; color?: string }> = ({ size = 80, color = "#FF4081" }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
    <path d="M 40 70 C 10 50 5 25 20 15 C 30 8 40 18 40 25 C 40 18 50 8 60 15 C 75 25 70 50 40 70 Z" fill={color} stroke="#fff" strokeWidth="2" />
  </svg>
);

export const StarIcon: React.FC<{ size?: number; color?: string }> = ({ size = 80, color = "#FFD400" }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
    <path d="M 40 5 L 48 30 L 75 32 L 53 50 L 60 75 L 40 60 L 20 75 L 27 50 L 5 32 L 32 30 Z" fill={color} stroke="#000" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

export const ToolIcon: React.FC<{ size?: number; color?: string }> = ({ size = 120, color = "#FFD400" }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
    <rect x="10" y="10" width="100" height="100" rx="6" stroke={color} strokeWidth="3" fill="none" />
    <path d="M 40 40 L 80 40 M 60 40 L 60 80" stroke={color} strokeWidth="6" strokeLinecap="round" />
  </svg>
);

export const RocketIcon: React.FC<{ size?: number; color?: string }> = ({ size = 120, color = "#FFD400" }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
    <path d="M 60 10 L 80 50 L 80 80 L 60 100 L 40 80 L 40 50 Z" fill={color} stroke="#000" strokeWidth="3" strokeLinejoin="round" />
    <circle cx="60" cy="40" r="8" fill="#000" />
    <path d="M 40 70 L 25 80 L 40 80 Z" fill="#FF6B00" />
    <path d="M 80 70 L 95 80 L 80 80 Z" fill="#FF6B00" />
  </svg>
);

export const IconRenderer: React.FC<{ shape: string; size?: number; color?: string }> = ({ shape, size, color }) => {
  switch (shape) {
    case "printer": return <PrinterIcon size={size} color={color} />;
    case "filament": return <FilamentIcon size={size} color={color} />;
    case "arduino": return <ArduinoIcon size={size} color={color} />;
    case "servo": return <ServoIcon size={size} color={color} />;
    case "usb": return <UsbIcon size={size} color={color} />;
    case "tool": return <ToolIcon size={size} color={color} />;
    case "rocket": return <RocketIcon size={size} color={color} />;
    case "bolt": return <BoltIcon size={size} color={color} />;
    default: return null;
  }
};
