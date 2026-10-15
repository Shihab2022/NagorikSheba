import {
  AlertTriangle,
  Baby,
  Bell,
  BookOpen,
  Briefcase,
  Building,
  Building2,
  Calculator,
  Car,
  Clock,
  FileText,
  GraduationCap,
  HeartHandshake,
  HeartPulse,
  IdCard,
  LandPlot,
  Landmark,
  Lightbulb,
  Link2Off,
  MessageSquare,
  Plane,
  Receipt,
  Scale,
  ScrollText,
  ShieldCheck,
  Sprout,
  Store,
  Truck,
  Wallet,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Maps serializable icon names stored in data files to Lucide components.
 * Data stays plain JSON so it can be swapped for API responses later.
 */
const ICONS: Record<string, LucideIcon> = {
  Baby,
  Bell,
  BookOpen,
  Briefcase,
  Building,
  Building2,
  Calculator,
  Car,
  Clock,
  FileText,
  GraduationCap,
  HeartHandshake,
  HeartPulse,
  IdCard,
  LandPlot,
  Landmark,
  Plane,
  Receipt,
  Scale,
  ScrollText,
  ShieldCheck,
  Sprout,
  Store,
  Truck,
  Wallet,
  LayoutGrid,
  AlertTriangle,
  Lightbulb,
  Link2Off,
  MessageSquare,
};

const FALLBACK = LayoutGrid;

export function Icon({
  name,
  className,
  ...props
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Component = ICONS[name] ?? FALLBACK;
  return <Component className={cn("h-5 w-5", className)} aria-hidden="true" {...props} />;
}

export default Icon;
