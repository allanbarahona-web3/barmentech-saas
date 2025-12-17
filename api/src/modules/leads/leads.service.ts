import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLeadDto } from './dto';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async create(createLeadDto: CreateLeadDto, tenantId: number) {
    return this.prisma.lead.create({
      data: {
        ...createLeadDto,
        tenantId,
      },
    });
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
