import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | import('rxjs').Observable<boolean> {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest<TUser = any>(err: any, user: TUser, info: any): TUser {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      // Customize the error message or type based on info or err
      // For example, if info is JsonWebTokenError, it means token is invalid
      // if info is TokenExpiredError, token is expired.
      throw (
        err ||
        new UnauthorizedException(
          (info as Error)?.message || 'Invalid or expired token.',
        )
      );
    }
    return user;
  }
}
