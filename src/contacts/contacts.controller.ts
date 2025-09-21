import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ContactsService } from './contacts.service';
import { CreateContactDto, UpdateContactDto, ContactResponseDto } from './dto/contact.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('Contacts')
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a contact form (Public)' })
  @ApiResponse({ status: 201, description: 'Contact form submitted successfully', type: ContactResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactsService.create(createContactDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all contact messages (Admin only)' })
  @ApiResponse({ status: 200, description: 'Contact messages retrieved successfully', type: [ContactResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  findAll() {
    return this.contactsService.findAll();
  }

  @Get('my-contacts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user contact messages' })
  @ApiResponse({ status: 200, description: 'User contact messages retrieved successfully', type: [ContactResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findMyContacts(@GetUser() user: any) {
    return this.contactsService.findByUser(user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Contact ID' })
  @ApiOperation({ summary: 'Get contact message by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Contact message retrieved successfully', type: ContactResponseDto })
  @ApiResponse({ status: 404, description: 'Contact message not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contactsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Contact ID' })
  @ApiOperation({ summary: 'Update contact message status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Contact message updated successfully', type: ContactResponseDto })
  @ApiResponse({ status: 404, description: 'Contact message not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateContactDto: UpdateContactDto) {
    return this.contactsService.update(id, updateContactDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Contact ID' })
  @ApiOperation({ summary: 'Delete contact message (Admin only)' })
  @ApiResponse({ status: 200, description: 'Contact message deleted successfully' })
  @ApiResponse({ status: 404, description: 'Contact message not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contactsService.remove(id);
  }
}
