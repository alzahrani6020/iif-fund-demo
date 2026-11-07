"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantMiddleware = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("@scc/database");
let TenantMiddleware = class TenantMiddleware {
    async use(req, res, next) {
        // Super Admin bypass - no tenant restrictions
        if (req.user?.role === 'SUPER_ADMIN') {
            req.tenantSlug = 'all';
            req.tenantId = undefined;
            return next();
        }
        const tenantSlug = req.headers['x-tenant-slug'] || req.subdomains[0] || null;
        if (tenantSlug) {
            const tenant = await database_1.prisma.tenant.findUnique({
                where: { slug: tenantSlug },
                select: { id: true, status: true, type: true },
            });
            if (!tenant) {
                return res.status(404).json({ error: 'Tenant not found', message: 'المنشأة غير موجودة' });
            }
            if (tenant.status !== 'ACTIVE') {
                return res.status(403).json({ error: 'Tenant is not active', message: 'المنشأة غير نشطة' });
            }
            req.tenantSlug = tenantSlug;
            req.tenantId = tenant.id;
        }
        next();
    }
};
exports.TenantMiddleware = TenantMiddleware;
exports.TenantMiddleware = TenantMiddleware = __decorate([
    (0, common_1.Injectable)()
], TenantMiddleware);
//# sourceMappingURL=tenant.middleware.js.map