import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';

import { Injectable } from '@nestjs/common';
import { API_HOST } from 'src/modules/config/conts';
import { AuthProvider, AuthService } from './auth.service';

config();

@Injectable()
export class GoogleAuthProvider extends PassportStrategy(Strategy, 'google') {

  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.API_RANDOM_ORDER_GOOGLE_CLIENT_ID,
      clientSecret: process.env.API_RANDOM_ORDER_GOOGLE_SECRET,
      callbackURL: `${API_HOST}/google/redirect`,
      passReqToCallback: true,
      scope: ['email', 'profile'],
    });
  }


  async validate(request: any, accessToken: string, refreshToken: string, profile, done: Function) {
    try {
      console.log(profile);

      const jwt: string = await this.authService.validateOAuthLogin(profile.id, AuthProvider.GOOGLE);
      const user =
      {
        jwt
      }

      done(null, user);
    }
    catch (err) {
      // console.log(err)
      done(err, false);
    }
  }
/*
  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, photos } = profile
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken
    }
    done(null, user);
  }*/
}