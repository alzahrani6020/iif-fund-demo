"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivitiesService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("@scc/database");
let ActivitiesService = class ActivitiesService {
    async findAll(req, query) {
        const where = { ...(0, database_1.tenantWhere)(req.user?.tenantId) };
        if (query.type)
            where.type = query.type;
        if (query.contactId)
            where.contactId = query.contactId;
        if (query.dealId)
            where.dealId = query.dealId;
        if (query.assignedToId)
            where.assignedToId = query.assignedToId;
        const [data, count] = await Promise.all([
            database_1.prisma.activity.findMany({ where, orderBy: { scheduledAt: 'asc' }, take: 200 }),
            database_1.prisma.activity.count({ where }),
        ]);
        return { data, count };
    }
    async findOne(req, id) {
        const where = { ...(0, database_1.tenantWhere)(req.user?.tenantId), id };
        const activity = await database_1.prisma.activity.findFirst({ where });
        if (!activity)
            throw new common_1.NotFoundException('Activity not found');
        return activity;
    }
    async create(req, dto) {
        const data = { ...dto, tenantId: req.user?.tenantId };
        if (dto.scheduledAt)
            data.scheduledAt = new Date(dto.scheduledAt);
        return database_1.prisma.activity.create({ data });
    }
    async update(req, id, dto) {
        const where = { ...(0, database_1.tenantWhere)(req.user?.tenantId), id };
        const existing = await database_1.prisma.activity.findFirst({ where });
        if (!existing)
            throw new common_1.NotFoundException('Activity not found');
        const data = { ...dto };
        if (dto.scheduledAt)
            data.scheduledAt = new Date(dto.scheduledAt);
        if (dto.completedAt)
            data.completedAt = new Date(dto.completedAt);
        return database_1.prisma.activity.update({ where: { id }, data });
    }
    async remove(req, id) {
        const where = { ...(0, database_1.tenantWhere)(req.user?.tenantId), id };
        const existing = await database_1.prisma.activity.findFirst({ where });
        if (!existing)
            throw new common_1.NotFoundException('Activity not found');
        return database_1.prisma.activity.delete({ where: { id } });
    }
};
exports.ActivitiesService = ActivitiesService;
exports.ActivitiesService = ActivitiesService = __decorate([
    (0, common_1.Injectable)()
], ActivitiesService);
//# sourceMappingURL=activities.service.js.map