import { NgModule, APP_INITIALIZER, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './auth.service';
import { appInitializer } from './app-initializer';
import { JwtInterceptor } from './jwt.interceptor';
import { UnauthorizedInterceptor } from './unauthorized.interceptor';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AuthService],
    },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedInterceptor,
      multi: true,
    },
  ],
})
export class AuthModule {
  constructor(@Optional() @SkipSelf() auth: AuthModule) {
    if (auth) {
      throw new Error('Core Module can only be imported to AppModule.');
    }
  }
}