import type { TablerIcon } from "@tabler/icons-react";

export interface FeatureItem {
  id: string;
  icon: TablerIcon;
  title: string;
  description: string;
  iconColor: string;
  bgColor: string;
  stroke?: number;
}
