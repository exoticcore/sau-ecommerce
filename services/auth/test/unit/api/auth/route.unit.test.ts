import { describe, it, expect } from '@jest/globals';
import router from '../../../../src/api/auth/auth-route';

describe('Auth routes', () => {
  function findRouteByName(routes: any, path: any) {
    return routes.find(
      (layer: any) => layer.route && layer.route.path === path
    );
  }

  const routes = [
    { path: '/login', method: 'post' },
    { path: '/signup', method: 'post' },
    { path: '/email', method: 'post' },
  ];

  it.each(routes)('`$method` exists on $path', (route) => {
    const expectedMethod = route.method;
    const singleRouteLayer = findRouteByName(router.stack, route.path);
    const receivedMethods = singleRouteLayer.route.methods;

    // Method control
    expect(Object.keys(receivedMethods).includes(expectedMethod)).toBe(true);

    // Path control
    expect(router.stack.some((s) => s.route.path === route.path)).toBe(true);
  });
});
