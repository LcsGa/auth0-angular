import { Provider } from '@angular/core';
import { Auth0ClientService, Auth0ClientFactory } from './auth.client';
import { AuthConfig, AuthConfigService, AuthClientConfig } from './auth.config';
import { AuthGuard } from './auth.guard';
import { AuthHttpInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';

type AuthConfigFactory = () => AuthConfig;

/**
 * Initialize the authentication system. Configuration can either be specified here,
 * or by calling AuthClientConfig.set (perhaps from an APP_INITIALIZER factory function).
 *
 * Note: Should only be used as of Angular 15, and should not be added to a component's providers.
 *
 * @param config The optional configuration for the SDK.
 *
 * @example
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideAuth0(),
 *   ],
 * });
 */
export function provideAuth0(
  config?: AuthConfig | AuthConfigFactory
): Provider[] {
  return [
    AuthService,
    AuthHttpInterceptor,
    AuthGuard,
    provideAuthConfigService(config),
    {
      provide: Auth0ClientService,
      useFactory: Auth0ClientFactory.createClient,
      deps: [AuthClientConfig],
    },
  ];
}

function provideAuthConfigService(config?: AuthConfig | AuthConfigFactory) {
  const provide = AuthConfigService;
  return typeof config === 'function'
    ? { provide, useFactory: config }
    : { provide, useValue: config };
}
