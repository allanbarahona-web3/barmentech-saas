import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { CreateLeadDto } from './dto';

@Injectable()
export class LeadsService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async create(createLeadDto: CreateLeadDto, tenantId: number) {
    // Crear el lead en BD
    const lead = await this.prisma.lead.create({
      data: {
        ...createLeadDto,
        tenantId,
      },
    });

    // Enviar emails automáticamente (no esperes respuesta para no bloquear)
    // Se envían en background
    this.emailService.sendLeadNotifications(lead, tenantId).catch((error) => {
      console.error(`Error enviando emails para lead ${lead.id}:`, error);
    });

    return lead;
  }

  async findAll(tenantId: number) {
    return this.prisma.lead.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, tenantId: number) {
    return this.prisma.lead.findFirst({
      where: {
        id,
        tenantId,
      },
    });
  }

  async update(id: string, updateData: Partial<CreateLeadDto>, tenantId: number) {
    return this.prisma.lead.updateMany({
      where: {
        id,
        tenantId,
      },
      data: updateData,
    });
  }

  async remove(id: string, tenantId: number) {
    return this.prisma.lead.deleteMany({
      where: {
        id,
        tenantId,
      },
    });
  }
}
