import { Strategy } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Profile } from 'passport-google-oauth20';
import { User } from '../../users/types/user.types';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<User> {
    const { email = '', given_name: firstName = '', family_name: lastName = '' } = profile._json;
    const user = await this.authService.validateOAuthUser(email, firstName, lastName, 'google');
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
