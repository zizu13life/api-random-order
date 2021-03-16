import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { GoogleAuthOptions } from 'google-auth-library';
import { url } from 'inspector';
import { API_HOST, WEB_HOST } from 'src/modules/config/conts';
import { GoogleAuthResponse } from '../dto/auth-models';
import { GoogleAuthProvider } from '../service/google-auth-provider.service';

@Controller('auth')
export class AuthController {

    constructor(private googleAuthProvider: GoogleAuthProvider) {

    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    googleLogin() {
        // initiates the Google OAuth2 login flow
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    googleLoginCallback(@Req() req, @Res() res) {
        // handles the Google OAuth2 callback
        const jwt: string = req.user.jwt;
        if (jwt)
            res.redirect(WEB_HOST + '/login/succes/' + jwt);
        else
            res.redirect(WEB_HOST + '/login/failure');
    }

    @Post('google/login')
    async googleLoginREST(@Body() body: GoogleAuthResponse, @Res({ passthrough: true }) response: Response) {
        const token = await this.googleAuthProvider.login(body);

        response.cookie('Authorization', token, {
            maxAge: 900000,
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            domain: new URL(API_HOST).hostname,
        });
    }

}