import { SiteHeaderClient } from '@/components/layout/site-header-client';
import { getPublicNavigationItems } from '@/lib/navigation';

export function SiteHeader() {
  return <SiteHeaderClient navItems={getPublicNavigationItems()} />;
}
