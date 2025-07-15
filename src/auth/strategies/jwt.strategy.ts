import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { User } from '../../../generated/prisma'; // Adjusted path

export interface JwtPayload {
  sub: number; // UserID
  username: string;
  role: string;
  businessId?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      // This will prevent the application from starting if JWT_SECRET is not set.
      // Consider a more robust configuration validation at the app bootstrap level.
      throw new InternalServerErrorException(
        'JWT_SECRET environment variable not set.',
      );
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: JwtPayload): Promise<Omit<User, 'PasswordHash'>> {
    const user = await this.usersService.findOneById(payload.sub);
    if (!user || !user.IsActive) {
      throw new UnauthorizedException('User not found or inactive.');
    }
    // Exclude password hash from the user object returned to the request context
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { PasswordHash, ...result } = user;
    return result;
  }
}
