import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Admin } from '../../entities';

export interface JwtPayload {
  sub: number;
  email: string;
  type: 'user' | 'admin';
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET', 'your_super_secret_jwt_key_here'),
    });
  }

  async validate(payload: JwtPayload) {
    const { sub, type } = payload;

    let user;
    if (type === 'user') {
      user = await this.userRepository.findOne({ where: { id: sub } });
    } else if (type === 'admin') {
      user = await this.adminRepository.findOne({ where: { id: sub } });
    }

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return { ...user, userType: type };
  }
} 