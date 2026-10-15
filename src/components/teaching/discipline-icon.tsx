import {
  BookOpenText,
  HandHeart,
  Landmark,
  Scale,
  ScrollText,
  type LucideIcon,
} from "lucide-react";
import type { DisciplineIcon as IconName } from "@/content/teaching";

/** Lucide icon for each teaching discipline. */
const icons: Record<IconName, LucideIcon> = {
  doctrine: BookOpenText,
  scripture: ScrollText,
  pastoral: HandHeart,
  ethics: Scale,
  history: Landmark,
};

export function DisciplineIcon({ name, className }: { name: IconName; className?: string }) {
  const Icon = icons[name];
  return <Icon aria-hidden strokeWidth={1.75} className={className} />;
}
