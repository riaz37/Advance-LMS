import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { Profile } from 'passport-facebook';
import { User } from '../../users/types/user.types';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get('FACEBOOK_APP_ID'),
      clientSecret: configService.get('FACEBOOK_APP_SECRET'),
      callbackURL: configService.get('FACEBOOK_CALLBACK_URL'),
      scope: ['email'],
      profileFields: ['emails', 'name'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<User> {
    const { email, first_name: firstName, last_name: lastName } = profile._json;
    const user = await this.authService.validateOAuthUser(email, firstName, lastName, 'facebook');
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
