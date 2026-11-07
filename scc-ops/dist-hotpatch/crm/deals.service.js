"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DealsService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("@scc/database");
let DealsService = class DealsService {
    async findAll(req, query) {
        const where = { ...(0, database_1.tenantWhere)(req.user?.tenantId) };
        if (query.stage)
            where.stage = query.stage;
        if (query.assignedToId)
            where.assignedToId = query.assignedToId;
        if (query.search) {
            where.OR = [
                { title: { contains: query.search, mode: 'insensitive' } },
                { description: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        const [data, count] = await Promise.all([
            database_1.prisma.deal.findMany({ where, orderBy: { createdAt: 'desc' }, take: 100 }),
            database_1.prisma.deal.count({ where }),
        ]);
        return { data, count };
    }
    async findOne(req, id) {
        const where = { ...(0, database_1.tenantWhere)(req.user?.tenantId), id };
        const deal = await database_1.prisma.deal.findFirst({ where });
        if (!deal)
            throw new common_1.NotFoundException('Deal not found');
        return deal;
    }
    async create(req, dto) {
        const data = { ...dto, tenantId: req.user?.tenantId };
        if (dto.expectedClose)
            data.expectedClose = new Date(dto.expectedClose);
        return database_1.prisma.deal.create({ data });
    }
    async update(req, id, dto) {
        const where = { ...(0, database_1.tenantWhere)(req.user?.tenantId), id };
        const existing = await database_1.prisma.deal.findFirst({ where });
        if (!existing)
            throw new common_1.NotFoundException('Deal not found');
        const data = { ...dto };
        if (dto.expectedClose)
            data.expectedClose = new Date(dto.expectedClose);
        if (dto.actualClose)
            data.actualClose = new Date(dto.actualClose);
        if (dto.stage === 'CLOSED_WON' || dto.stage === 'CLOSED_LOST') {
            data.actualClose = new Date();
        }
        return database_1.prisma.deal.update({ where: { id }, data });
    }
    async remove(req, id) {
        const where = { ...(0, database_1.tenantWhere)(req.user?.tenantId), id };
        const existing = await database_1.prisma.deal.findFirst({ where });
        if (!existing)
            throw new common_1.NotFoundException('Deal not found');
        return database_1.prisma.deal.delete({ where: { id } });
    }
};
exports.DealsService = DealsService;
exports.DealsService = DealsService = __decorate([
    (0, common_1.Injectable)()
], DealsService);
//# sourceMappingURL=deals.service.js.map