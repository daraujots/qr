
export interface QRConfig {
  value: string;
  size: number;
  fgColor: string;
  bgColor: string;
  level: 'L' | 'M' | 'Q' | 'H';
  includeMargin: boolean;
  imageSettings?: {
    src: string;
    x?: number;
    y?: number;
    height: number;
    width: number;
    excavate: boolean;
  };
}

export type QRType = 'url' | 'text' | 'wifi' | 'vcard' | 'email';

export interface HistoryItem {
  id: string;
  value: string;
  type: QRType;
  timestamp: number;
}
