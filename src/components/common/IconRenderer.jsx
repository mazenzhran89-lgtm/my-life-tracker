import React from 'react';
import {
  Activity,
  Heart,
  GraduationCap,
  Languages,
  Code,
  Dumbbell,
  BookOpen,
  Sparkles,
  Compass,
  Flame,
  Smile,
  Target,
  CheckCircle,
  Trophy,
  Sun,
  Moon,
  Coffee,
  Laptop,
  Music,
  Briefcase,
  Layers,
  Star,
  Zap,
  Globe,
  Feather
} from 'lucide-react';

const ICON_MAP = {
  Activity,
  Heart,
  GraduationCap,
  Languages,
  Code,
  Dumbbell,
  BookOpen,
  Sparkles,
  Compass,
  Flame,
  Smile,
  Target,
  CheckCircle,
  Trophy,
  Sun,
  Moon,
  Coffee,
  Laptop,
  Music,
  Briefcase,
  Layers,
  Star,
  Zap,
  Globe,
  Feather
};

export const AVAILABLE_ICONS = Object.keys(ICON_MAP);

export function IconRenderer({ name, className = 'w-5 h-5', ...props }) {
  const IconComponent = ICON_MAP[name] || Layers;
  return <IconComponent className={className} {...props} />;
}
