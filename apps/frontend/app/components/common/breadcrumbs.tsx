import { Breadcrumbs, Anchor } from '@mantine/core';
import { Link, useLocation } from 'react-router';

const formatTitle = (path: string): string => 
  path.charAt(0).toUpperCase() + path.slice(1);

export function AppBreadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x: string) => x);

  // Don't render breadcrumbs on home page
  if (pathnames.length === 0) {
    return null;
  }

  // Build breadcrumbs based on known routes
  const breadcrumbs = [];
  let currentPath = '';
  
  // First, filter out dynamic segments
  const visiblePaths = pathnames.filter(path => !path.includes('_'));

  for (let i = 0; i < pathnames.length; i++) {
    const path = pathnames[i];
    
    // Skip segments containing underscores (dynamic routes)
    if (path.includes('_')) {
      continue;
    }

    currentPath += `/${path}`;
    const isLast = visiblePaths[visiblePaths.length - 1] === path;
    const title = formatTitle(path);

    breadcrumbs.push(
      isLast ? (
        <span key={currentPath}>{title}</span>
      ) : (
        <Anchor component={Link} to={currentPath} key={currentPath}>
          {title}
        </Anchor>
      )
    );
  }

  return (
    <Breadcrumbs>
      <Anchor component={Link} to="/">
        Home
      </Anchor>
      {breadcrumbs}
    </Breadcrumbs>
  );
}