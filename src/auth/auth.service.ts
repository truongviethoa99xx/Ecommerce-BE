import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, Admin } from '../entities';
import { RegisterDto, LoginDto, AdminLoginDto, AdminRegisterDto, AdminStatusDto } from './dto/auth.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, ...userData } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = this.userRepository.create({
      ...userData,
      email,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    // Generate JWT token
    const payload: JwtPayload = { sub: savedUser.id, email: savedUser.email, type: 'user' };
    const access_token = this.jwtService.sign(payload);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = savedUser;

    return {
      access_token,
      user: userWithoutPassword,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload: JwtPayload = { sub: user.id, email: user.email, type: 'user' };
    const access_token = this.jwtService.sign(payload);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return {
      access_token,
      user: userWithoutPassword,
    };
  }

  async adminLogin(adminLoginDto: AdminLoginDto) {
    const { email, password } = adminLoginDto;

    // Find admin by username
    const admin = await this.adminRepository.findOne({ where: { email } });
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload: JwtPayload = { sub: admin.id, email: admin.email, type: 'admin' };
    const access_token = this.jwtService.sign(payload);

    // Remove password from response
    const { password: _, ...adminWithoutPassword } = admin;

    return {
      access_token,
      user: adminWithoutPassword,
    };
  }

  async createAdmin(adminRegisterDto: AdminRegisterDto) {
    const { username, email, password, name } = adminRegisterDto;

    const existingByUsername = await this.adminRepository.findOne({ where: { username } });
    if (existingByUsername) {
      throw new ConflictException('Username already exists');
    }

    const existingByEmail = await this.adminRepository.findOne({ where: { email } });
    if (existingByEmail) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = this.adminRepository.create({
      username,
      name,
      email,
      password: hashedPassword,
      role: 'admin',
    });
    const savedAdmin = await this.adminRepository.save(admin);

    const payload: JwtPayload = { sub: savedAdmin.id, email: savedAdmin.email, type: 'admin' };
    const access_token = this.jwtService.sign(payload);

    const { password: _, ...adminWithoutPassword } = savedAdmin;

    return {
      access_token,
      user: adminWithoutPassword,
    };
  }
  async createDefaultAdmin() {
    const existingAdmin = await this.adminRepository.findOne({ 
      where: { username: 'admin' } 
    });
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = this.adminRepository.create({
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
      });
      await this.adminRepository.save(admin);
    }
  }

  async listAdmins() {
    return this.adminRepository.find({
      select: ['id', 'username', 'name', 'email', 'role', 'status', 'createdAt'],
      order: { createdAt: 'DESC' },
    });
  }

  async changeAdminStatus(id: number, adminStatusDto: AdminStatusDto) {
    const { status } = adminStatusDto;
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) {
      throw new UnauthorizedException('Admin not found');
    }
    admin.status = status;
    await this.adminRepository.save(admin);
    const { password: _, ...result } = admin;
    return result;
  }

  async resetAdminPassword(id: number) {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) {
      throw new UnauthorizedException('Admin not found');
    }
    admin.password = await bcrypt.hash('abc123', 10);
    await this.adminRepository.save(admin);
    const { password: _, ...result } = admin;
    return result;
  }
} 