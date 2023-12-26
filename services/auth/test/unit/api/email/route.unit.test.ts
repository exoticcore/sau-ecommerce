import { describe, test, expect } from '@jest/globals';
import router from '../../../../src/api/email/email-route';

describe('Email Route Unit Testing', () => {
  function findRouteByName(routes: any, path: any) {
    return routes.find(
      (layer: any) => layer.route && layer.route.path === path
    );
  }

  const routes = [
    { path: '/check', method: 'post' },
    { path: '/verify', method: 'get' },
  ];

  test.each(routes)('`$method` exists on $path', (route) => {
    const expectedMethod = route.method;
    const singleRouteLayer = findRouteByName(router.stack, route.path);
    const receivedMethods = singleRouteLayer.route.methods;

    // Method control
    expect(Object.keys(receivedMethods).includes(expectedMethod)).toBe(true);

    // Path control
    expect(router.stack.some((s) => s.route.path === route.path)).toBe(true);
  });
});
