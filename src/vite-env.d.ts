// vite-env.d.ts
/// <reference types="vite/client" />

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// Lucide-react type declarations
declare module 'lucide-react' {
  import type { FC, SVGProps } from 'react';
  
  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
    strokeWidth?: number;
    absoluteStrokeWidth?: boolean;
  }
  
  export type Icon = FC<IconProps>;
  
  // Statistical tool icons
  export const Activity: Icon;
  export const AlertTriangle: Icon;
  export const BarChart2: Icon;
  export const BarChart3: Icon;
  export const GitCompare: Icon;
  export const LineChart: Icon;
  export const Loader2: Icon;
  export const Network: Icon;
  export const SplitSquareHorizontal: Icon;
  export const Table: Icon;
  export const Upload: Icon;
  export const Wand2: Icon;
  export const X: Icon;
  
  // General icons
  export const AlertCircle: Icon;
  export const ArrowLeft: Icon;
  export const ArrowRight: Icon;
  export const Bell: Icon;
  export const Check: Icon;
  export const CheckCircle: Icon;
  export const ChevronDown: Icon;
  export const ChevronLeft: Icon;
  export const ChevronRight: Icon;
  export const ChevronUp: Icon;
  export const Clock: Icon;
  export const Cloud: Icon;
  export const CloudRain: Icon;
  export const CloudSnow: Icon;
  export const Copy: Icon;
  export const Download: Icon;
  export const Edit: Icon;
  export const Eye: Icon;
  export const EyeOff: Icon;
  export const File: Icon;
  export const FileText: Icon;
  export const FlaskConical: Icon;
  export const Folder: Icon;
  export const Gauge: Icon;
  export const Github: Icon;
  export const Globe: Icon;
  export const Heart: Icon;
  export const HelpCircle: Icon;
  export const Home: Icon;
  export const Image: Icon;
  export const Info: Icon;
  export const Link: Icon;
  export const Loader: Icon;
  export const LogIn: Icon;
  export const LogOut: Icon;
  export const Mail: Icon;
  export const Menu: Icon;
  export const MessageCircle: Icon;
  export const Minus: Icon;
  export const Moon: Icon;
  export const MoreHorizontal: Icon;
  export const MoreVertical: Icon;
  export const Pause: Icon;
  export const Play: Icon;
  export const Plus: Icon;
  export const Power: Icon;
  export const RefreshCw: Icon;
  export const RotateCcw: Icon;
  export const Save: Icon;
  export const ScrollText: Icon;
  export const Search: Icon;
  export const Send: Icon;
  export const Settings: Icon;
  export const Share: Icon;
  export const Shield: Icon;
  export const ShoppingCart: Icon;
  export const Star: Icon;
  export const Sun: Icon;
  export const Trash: Icon;
  export const Trash2: Icon;
  export const User: Icon;
  export const Users: Icon;
  export const XCircle: Icon;
  export const Zap: Icon;
  export const ZoomIn: Icon;
  export const ZoomOut: Icon;
}