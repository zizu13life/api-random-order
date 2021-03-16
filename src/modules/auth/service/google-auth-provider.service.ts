import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';

import { Injectable } from '@nestjs/common';
import { API_HOST } from 'src/modules/config/conts';
import { OAuth2Client } from 'google-auth-library';
import { GoogleAuthResponse } from '../dto/auth-models';
import { User } from '../../user/entity/user';
import { google } from 'googleapis';
import { AuthProvider } from '../dto/auth-provider.enum';
import { AuthService } from './auth.service';

config();

@Injectable()
export class GoogleAuthProvider extends PassportStrategy(Strategy, 'google') {
  oauth2Client = new google.auth.OAuth2(
    process.env.API_RANDOM_ORDER_GOOGLE_CLIENT_ID,
    process.env.API_RANDOM_ORDER_GOOGLE_SECRET,
    `${API_HOST}/google/redirect`
  );


  constructor(private authService: AuthService) {
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

      const jwt: string = await this.authService.validateOAuthLogin(null, profile.id, AuthProvider.GOOGLE);
      const user = {
        jwt
      }

      done(null, user);
    }
    catch (err) {
      // console.log(err)
      done(err, false);
    }
  }

  async login(data: GoogleAuthResponse) {
    const info = await this.oauth2Client.verifyIdToken({ idToken: data.id_token });

    const getUser = async () => {
      const OAuth2 = google.auth.OAuth2;
      const oauth2Client = new OAuth2();
      oauth2Client.setCredentials({ access_token: data.access_token });
      const oauth2 = google.oauth2({
        auth: oauth2Client,
        version: 'v2'
      });
      const userInfo = await oauth2.userinfo.get();
      const user: User = {
        id: null,
        firstName: userInfo.data.given_name, lastName: userInfo.data.family_name,
        avatar: userInfo.data.picture,
        isActive: true,
        isAdmin: false,
      };
      return user;
    }

    const jwt: string = await this.authService.validateOAuthLogin(getUser, info.getUserId(), AuthProvider.GOOGLE);
    return jwt;
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