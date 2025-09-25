import { Controller, Post, Body, UseGuards, Get, Param, Patch, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, AdminLoginDto, AdminRegisterDto, AuthResponseDto, AdminStatusDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully', type: AuthResponseDto })
  @ApiResponse({ status: 409, description: 'User with this email already exists' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('admin/login')
  @ApiOperation({ summary: 'Login admin' })
  @ApiResponse({ status: 200, description: 'Admin logged in successfully', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async adminLogin(@Body() adminLoginDto: AdminLoginDto) {
    return this.authService.adminLogin(adminLoginDto);
  }

  @Post('admin/register')
  @ApiOperation({ summary: 'Register a new admin' })
  @ApiResponse({ status: 201, description: 'Admin created successfully', type: AuthResponseDto })
  @ApiResponse({ status: 409, description: 'Admin with this username/email already exists' })
  async adminRegister(@Body() adminRegisterDto: AdminRegisterDto) {
    return this.authService.createAdmin(adminRegisterDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@GetUser() user: any) {
    return { user };
  }

  @Get('admin')
  @ApiOperation({ summary: 'List admins' })
  @ApiResponse({ status: 200, description: 'Admins list retrieved successfully' })
  async listAdmins() {
    return this.authService.listAdmins();
  }

  @Post('admin/:id/status')
  @ApiOperation({ summary: 'Change admin status' })
  @ApiResponse({ status: 200, description: 'Admin status updated successfully' })
  async changeAdminStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() adminStatusDto: AdminStatusDto,
  ) {
    return this.authService.changeAdminStatus(id, adminStatusDto);
  }

  @Post('admin/:id/reset-password')
  @ApiOperation({ summary: 'Reset admin password to abc123' })
  @ApiResponse({ status: 200, description: 'Admin password reset successfully' })
  async resetAdminPassword(@Param('id', ParseIntPipe) id: number) {
    return this.authService.resetAdminPassword(id);
  }
} 