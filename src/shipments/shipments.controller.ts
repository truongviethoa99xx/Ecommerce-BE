import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ShipmentsService } from './shipments.service';
import { CreateShipmentDto, UpdateShipmentDto, ShipmentResponseDto } from './dto/shipment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('Shipments')
@Controller('shipments')
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new shipment (Admin only)' })
  @ApiResponse({ status: 201, description: 'Shipment created successfully', type: ShipmentResponseDto })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  create(@Body() createShipmentDto: CreateShipmentDto) {
    return this.shipmentsService.create(createShipmentDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all shipments (Admin only)' })
  @ApiQuery({ name: 'orderId', required: false, description: 'Filter by order ID' })
  @ApiResponse({ status: 200, description: 'Shipments retrieved successfully', type: [ShipmentResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  findAll(@Query('orderId') orderId?: string) {
    if (orderId) {
      return this.shipmentsService.findByOrder(parseInt(orderId));
    }
    return this.shipmentsService.findAll();
  }

  @Get('track/:trackingNumber')
  @ApiParam({ name: 'trackingNumber', description: 'Tracking number' })
  @ApiOperation({ summary: 'Track shipment by tracking number' })
  @ApiResponse({ status: 200, description: 'Shipment tracking info retrieved', type: ShipmentResponseDto })
  @ApiResponse({ status: 404, description: 'Shipment not found' })
  trackShipment(@Param('trackingNumber') trackingNumber: string) {
    return this.shipmentsService.trackShipment(trackingNumber);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Shipment ID' })
  @ApiOperation({ summary: 'Get shipment by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Shipment retrieved successfully', type: ShipmentResponseDto })
  @ApiResponse({ status: 404, description: 'Shipment not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.shipmentsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Shipment ID' })
  @ApiOperation({ summary: 'Update shipment (Admin only)' })
  @ApiResponse({ status: 200, description: 'Shipment updated successfully', type: ShipmentResponseDto })
  @ApiResponse({ status: 404, description: 'Shipment not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateShipmentDto: UpdateShipmentDto) {
    return this.shipmentsService.update(id, updateShipmentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Shipment ID' })
  @ApiOperation({ summary: 'Delete shipment (Admin only)' })
  @ApiResponse({ status: 200, description: 'Shipment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Shipment not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.shipmentsService.remove(id);
  }
} 