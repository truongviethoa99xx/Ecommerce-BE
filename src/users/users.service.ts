import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    console.log("🚀 ~ UsersService ~ create ~ createUserDto:", createUserDto)
    const { email, password, ...userData } = createUserDto;

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
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async findAll() {
    const users = await this.userRepository.find({
      select: ['id', 'name', 'email', 'phone', 'address', 'createdAt', 'updatedAt'],
    });
    return users;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'phone', 'address', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check email uniqueness if email is being updated
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({ 
        where: { email: updateUserDto.email } 
      });
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    // Update user
    await this.userRepository.update(id, updateUserDto);
    
    // Return updated user without password
    const updatedUser = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'phone', 'address', 'createdAt', 'updatedAt'],
    });

    return updatedUser;
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.remove(user);
    return { message: 'User deleted successfully' };
  }
} 