import { Role } from '@prisma/client';
import { Auth, google } from 'googleapis';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { EnvService } from 'src/modules/share/services/env.service';
import { TokenService } from 'src/modules/share/services/token.service';
import { RoleRepository } from 'src/modules/share/repositories/role.repository';
import { UserRepository } from 'src/modules/share/repositories/user.repository';
import { DeviceRepository } from 'src/modules/share/repositories/device.repository';
import { PasswordEncoderService } from 'src/modules/share/services/passwordEncoder.service';
import { RefreshTokenRepository } from 'src/modules/share/repositories/refreshToken.repository';

@Injectable()
export class GoogleService {
  private oauth2Client: Auth.OAuth2Client;
  constructor(
    private envService: EnvService,
    private tokenService: TokenService,
    private passwordEncoderSerivice: PasswordEncoderService,
    private userRepository: UserRepository,
    private roleRepository: RoleRepository,
    private deviceRepository: DeviceRepository,
    private refreshTokenRepository: RefreshTokenRepository,
  ) {
    this.oauth2Client = new google.auth.OAuth2({
      clientId: this.envService.GG_CLIENT_ID,
      clientSecret: this.envService.GG_CLIENT_SECRET,
      redirectUri: this.envService.GG_REDIRECT_URI,
    });
  }

  getGoogleLoginLink({ ip, userAgent }: { ip: string; userAgent: string }) {
    const scope = ['email', 'profile'];
    const state = Buffer.from(JSON.stringify({ ip, userAgent })).toString(
      'base64',
    );
    return {
      url: this.oauth2Client.generateAuthUrl({
        access_type: 'offline',
        include_granted_scopes: true,
        scope,
        state,
      }),
    };
  }
  async googleOAuthCallback({ code, state }: { code: string; state: string }) {
    try {
      const { ip, userAgent } = JSON.parse(
        Buffer.from(state, 'base64').toString(),
      );
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);

      const oauth2 = google.oauth2({
        auth: this.oauth2Client,
        version: 'v2',
      });
      const { data } = await oauth2.userinfo.get();

      if (!data.email) {
        throw new UnauthorizedException('email not found');
      }
      const clientRole = (await this.roleRepository.findByName(
        'CLIENT',
      )) as Role;

      let user = await this.userRepository.findByIdOrEmail({
        unique: { email: data.email },
      });

      if (!user) {
        user = await this.userRepository.create({
          email: data.email,
          name: data.name || 'unknown',
          password: this.passwordEncoderSerivice.randomPassword(),
          roleId: clientRole.id,
          avatar: data.picture || 'unknown',
        });
      }

      const device = await this.deviceRepository.create({
        ip: ip || 'unknown',
        userAgent: userAgent || 'unknown',
        userId: user.id,
      });

      const [accessToken, refreshToken] = await this.tokenService.createTokens({
        userId: user.id,
        email: user.email,
        roleId: user.roleId,
        deviceId: device.id,
      });
      const { exp } = this.tokenService.decodeToken(refreshToken);
      await this.refreshTokenRepository.create({
        token: refreshToken,
        expireAt: new Date(exp * 1000),
        deviceId: device.id,
        userId: user.id,
      });
      return { accessToken, refreshToken };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
