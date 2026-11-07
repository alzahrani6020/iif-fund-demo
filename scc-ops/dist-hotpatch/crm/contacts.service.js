"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactsService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("@scc/database");
// Only fields the CRM form submits / the schema exposes to clients. Ownership
// and system fields (id, createdAt, updatedAt) are never taken from the client;
// tenantId is accepted but gated by role in create/update below.
const CONTACT_PAYLOAD_FIELDS = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'phone2',
    'companyName',
    'jobTitle',
    'idNumber',
    'vatNumber',
    'crNumber',
    'address',
    'city',
    'region',
    'country',
    'type',
    'status',
    'tenantId',
];
function pickContactPayload(source) {
    const src = source;
    const payload = {};
    for (const field of CONTACT_PAYLOAD_FIELDS) {
        if (src[field] !== undefined)
            payload[field] = src[field];
    }
    return payload;
}
let ContactsService = class ContactsService {
    db;
    // Injectable for tests (in-memory fake); Nest resolves the default in prod.
    constructor(db = database_1.prisma) {
        this.db = db;
    }
    async findAll(tenantId, userRole, filters = {}) {
        const page = Math.max(1, Math.floor(filters.page ?? 1) || 1);
        const limit = Math.min(100, Math.max(1, Math.floor(filters.limit ?? 25) || 25));
        const where = userRole === 'SUPER_ADMIN' ? {} : (0, database_1.withTenant)({}, tenantId);
        if (filters.type)
            where.type = filters.type;
        if (filters.status)
            where.status = filters.status;
        if (filters.search) {
            where.OR = [
                { firstName: { contains: filters.search, mode: 'insensitive' } },
                { lastName: { contains: filters.search, mode: 'insensitive' } },
                { email: { contains: filters.search, mode: 'insensitive' } },
                { phone: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        const [data, count] = await Promise.all([
            this.db.contact.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.db.contact.count({ where }),
        ]);
        return { data, count, page, limit };
    }
    async findOne(tenantId, userRole, id) {
        const where = userRole === 'SUPER_ADMIN' ? { id } : (0, database_1.withTenant)({ id }, tenantId);
        const contact = await this.db.contact.findFirst({ where });
        if (!contact)
            throw new common_1.NotFoundException('Contact not found');
        return contact;
    }
    async create(tenantId, userRole, dto) {
        if (userRole === 'SUPER_ADMIN' && !dto.tenantId) {
            throw new common_1.NotFoundException('Super Admin must specify tenantId when creating');
        }
        const data = pickContactPayload(dto);
        data.tenantId = userRole === 'SUPER_ADMIN' ? dto.tenantId : tenantId;
        return this.db.contact.create({ data: data });
    }
    async update(tenantId, userRole, id, dto) {
        const where = userRole === 'SUPER_ADMIN' ? { id } : (0, database_1.withTenant)({ id }, tenantId);
        const contact = await this.db.contact.findFirst({ where });
        if (!contact)
            throw new common_1.NotFoundException('Contact not found');
        const data = pickContactPayload(dto);
        // Non-SUPER_ADMIN can never move a contact across tenants.
        if (userRole !== 'SUPER_ADMIN')
            delete data.tenantId;
        return this.db.contact.update({ where: { id }, data: data });
    }
    async delete(tenantId, userRole, id) {
        const where = userRole === 'SUPER_ADMIN' ? { id } : (0, database_1.withTenant)({ id }, tenantId);
        const contact = await this.db.contact.findFirst({ where });
        if (!contact)
            throw new common_1.NotFoundException('Contact not found');
        return this.db.contact.delete({ where: { id } });
    }
};
exports.ContactsService = ContactsService;
exports.ContactsService = ContactsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Function])
], ContactsService);
//# sourceMappingURL=contacts.service.js.map