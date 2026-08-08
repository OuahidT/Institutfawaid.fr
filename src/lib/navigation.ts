import { siteConfig } from '@/config/site';
import { hasPublishedResources } from '@/lib/resources';
import type { NavItem } from '@/types/content';

const resourcesNavigationItem: NavItem = {
  label: 'Conseils & Ressources',
  href: '/ressources',
};

export function getPublicNavigationItems() {
  return hasPublishedResources()
    ? [...siteConfig.nav, resourcesNavigationItem]
    : siteConfig.nav;
}
