import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import ms, { StringValue } from 'ms';

import { Role } from 'generated/prisma';
import { EnvService } from '../../share/services/env.service';
import { TokenService } from '../../share/services/token.service';
import { PrismaService } from '../../share/services/prisma.service';
import { createOtpCode } from '../../share/utils/createOtpCode.util';
import { RoleRepository } from '../../share/repositories/role.repository';
import { UserRepository } from '../../share/repositories/user.repository';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  SendOtpDto,
} from '../auth.dto';
import { PasswordEncoderService } from '../../share/services/passwordEncoder.service';
import { VerificationCodeRepository } from '../../share/repositories/verificationCode.repository';
import { EmailService } from './email.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private envService: EnvService,
    private emailService: EmailService,
    private tokenService: TokenService,
    private userRepository: UserRepository,
    private roleRepository: RoleRepository,
    private verificationCodeRepository: VerificationCodeRepository,
    private passwordEncoderService: PasswordEncoderService,
  ) {}

  async register({ email, password, phoneNumber, name, code }: RegisterDto) {
    const verificationCode =
      await this.verificationCodeRepository.findByEmailAndCodeAndType({
        code,
        email,
        type: 'REGISTER',
      });

    if (!verificationCode) {
      throw new UnprocessableEntityException('invalid otp code');
    }

    if (verificationCode.expireAt < new Date()) {
      throw new UnprocessableEntityException('otp code has expired');
    }

    const isPhone =
      await this.userRepository.isPhoneNumberExisting(phoneNumber);

    if (isPhone) {
      throw new ConflictException('phone number already existed');
    }

    const clientRole = (await this.roleRepository.findByName('CLIENT')) as Role;
    const [user] = await Promise.all([
      this.userRepository.createUser({
        email,
        name,
        password,
        phoneNumber,
        roleId: clientRole.id,
      }),
      this.verificationCodeRepository.deleteById(verificationCode.id),
    ]);
    return user;
  }

  async login({ email, password }: LoginDto) {
    try {
      const user = await this.prismaService.user.findUniqueOrThrow({
        where: {
          email,
        },
      });
      const isMatching = await this.passwordEncoderService.compare(
        password,
        user.password,
      );
      if (!isMatching) {
        throw new Error('password not equal');
      }
      const [accessToken, refreshToken] =
        await this.tokenService.createTokens(user);
      const { exp } = this.tokenService.decodeToken(refreshToken);
      await this.prismaService.refreshToken.create({
        data: {
          token: refreshToken,
          expireAt: new Date(exp * 1000),
          userId: user.id,
        },
      });
      return { accessToken, refreshToken };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('user not found');
    }
  }

  async refresh({ token }: RefreshTokenDto) {
    try {
      const { userId } = await this.tokenService.verifyRefreshToken(token);
      await this.prismaService.refreshToken.findUniqueOrThrow({
        where: {
          token,
        },
      });
      const user = await this.prismaService.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
      });
      const [accessToken, refreshToken] =
        await this.tokenService.createTokens(user);
      const { exp } = this.tokenService.decodeToken(refreshToken);
      this.prismaService.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expireAt: new Date(exp * 1000),
        },
      });
      return { accessToken, refreshToken };
    } catch (error) {
      // đã refresh token rồi, thông báo cho user biết token của họ bị đánh cắp
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code == 'P2025'
      ) {
        throw new UnauthorizedException('refresh token has been revoked');
      }
      throw new UnauthorizedException('invalid refresh token');
    }
  }

  async logout({ token }: RefreshTokenDto) {
    await this.prismaService.refreshToken.delete({
      where: {
        token,
      },
    });
  }

  async getProfile(id: number) {
    return await this.userRepository.findById(id);
  }

  async sendOtp({ email, type }: SendOtpDto) {
    const isEmail = await this.userRepository.findByEmail(email);
    if (isEmail) {
      throw new ConflictException('email already existed');
    }
    const code = createOtpCode();
    const expireAt = new Date(
      Date.now() + ms(this.envService.OTP_EXPIRE as StringValue),
    );
    const { error } = await this.emailService.sendOtpCode({
      toEmail: 'lnanh952005@gmail.com',
      otpCode: code,
    });
    if (error) {
      throw new BadRequestException([{
        ...error,
      }]);
    }
    return await this.verificationCodeRepository.upsertVerificationCode({
      where: {
        email,
      },
      create: {
        code,
        email,
        type,
        expireAt,
      },
      update: {
        code,
        expireAt,
      },
    });
  }
}
