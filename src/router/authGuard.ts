import type { NavigationGuard } from 'vue-router';
import { isClerkConfigured } from '@/lib/clerk';

type ClerkWindow = Window & {
  Clerk?: {
    loaded?: boolean;
    user?: unknown;
  };
};

function waitForClerk(): Promise<void> {
  return new Promise((resolve) => {
    const win = window as ClerkWindow;
    if (win.Clerk?.loaded) {
      resolve();
      return;
    }
    const interval = setInterval(() => {
      if ((window as ClerkWindow).Clerk?.loaded) {
        clearInterval(interval);
        resolve();
      }
    }, 50);
  });
}

const AUTH_ROUTE_NAMES = new Set(['sign-in', 'sign-up']);

export const authGuard: NavigationGuard = async (to, _from, next) => {
  if (!isClerkConfigured()) {
    if (to.meta.requiresAuth || AUTH_ROUTE_NAMES.has(String(to.name))) {
      next('/');
      return;
    }
    next();
    return;
  }

  if (!to.meta.requiresAuth) {
    next();
    return;
  }

  await waitForClerk();

  if ((window as ClerkWindow).Clerk?.user) {
    next();
    return;
  }

  next({ path: '/sign-in', query: { redirect: to.fullPath } });
};
