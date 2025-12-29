import { Controller, Post, Get, Body, Param, Patch, Delete, HttpCode, BadRequestException } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto';
import { CurrentTenant } from 'src/common/decorators';

/**
 * ============================================================
 * PUBLIC CONTACT ENDPOINT
 * ============================================================
 */
@Controller('api/contact')
export class PublicContactController {
  constructor(private readonly leadsService: LeadsService) {}

  /**
   * POST /api/v1/contact - Formulario de contacto público
   * Sin autenticación - cualquiera puede enviar
   * Se almacena como un lead y envía emails automáticamente
   */
  @Post()
  @HttpCode(201)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async submitContact(
    @Body() createLeadDto: CreateLeadDto,
    @CurrentTenant() tenantId: number,
  ) {
    if (!tenantId) {
      throw new BadRequestException('Unable to determine tenant from domain');
    }
    const lead = await this.leadsService.create(createLeadDto, tenantId);
    return {
      success: true,
      message: 'Formulario recibido. Nos pondremos en contacto pronto.',
      data: lead,
    };
  }
}

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  /**
   * POST /api/v1/leads - Create a new lead from form submission
   * Rate limited: 10 requests per 60 seconds per IP to prevent spam
   */
  @Post()
  @HttpCode(201)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async create(
    @Body() createLeadDto: CreateLeadDto,
    @CurrentTenant() tenantId: number,
  ) {
    const lead = await this.leadsService.create(createLeadDto, tenantId);
    return {
      message: 'Lead creado exitosamente',
      data: lead,
    };
  }

  /**
   * GET /api/v1/leads - List all leads for current tenant
   */
  @Get()
  async findAll(@CurrentTenant() tenantId: number) {
    const leads = await this.leadsService.findAll(tenantId);
    return {
      data: leads,
      count: leads.length,
    };
  }

  /**
   * GET /api/v1/leads/:id - Get specific lead
   */
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentTenant() tenantId: number,
  ) {
    const lead = await this.leadsService.findOne(id, tenantId);
    return { data: lead };
  }

  /**
   * PATCH /api/v1/leads/:id - Update lead
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLeadDto: Partial<CreateLeadDto>,
    @CurrentTenant() tenantId: number,
  ) {
    await this.leadsService.update(id, updateLeadDto, tenantId);
    return { message: 'Lead actualizado' };
  }

  /**
   * DELETE /api/v1/leads/:id - Delete lead
   */
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentTenant() tenantId: number,
  ) {
    await this.leadsService.remove(id, tenantId);
    return { message: 'Lead eliminado' };
  }
}
