"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogInterceptor = void 0;
exports.deriveAuditAction = deriveAuditAction;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const database_1 = require("@scc/database");
const SENSITIVE_FIELDS = ['password', 'passwordHash', 'token', 'secret', 'otp', 'csid', 'privateKey'];
function sanitizeBody(body) {
    if (!body || typeof body !== 'object')
        return body;
    const sanitized = Array.isArray(body) ? [...body] : { ...body };
    for (const key of Object.keys(sanitized)) {
        if (SENSITIVE_FIELDS.includes(key.toLowerCase())) {
            sanitized[key] = '***REDACTED***';
        }
        else if (typeof sanitized[key] === 'object') {
            sanitized[key] = sanitizeBody(sanitized[key]);
        }
    }
    return sanitized;
}
function getEntityType(path) {
    const segments = path.split('/').filter(Boolean);
    const idx = segments.findIndex((s) => ['auth', 'zatca', 'erp', 'crm', 'hr', 'finance', 'fleet', 'inventory', 'analytics', 'government', 'projects', 'notifications', 'alerts', 'templates', 'users', 'settings', 'billing'].includes(s));
    return idx >= 0 ? segments[idx].toUpperCase() : 'UNKNOWN';
}
// Enrich well-known entity mutations with specific action labels; everything
// else keeps the raw HTTP method as the action (existing behavior).
function deriveAuditAction(method, path) {
    if (/\/crm\/contacts\b/.test(path)) {
        if (method === 'POST')
            return 'CONTACT_CREATED';
        if (method === 'PATCH' || method === 'PUT')
            return 'CONTACT_UPDATED';
        if (method === 'DELETE')
            return 'CONTACT_DELETED';
    }
    return method;
}
let AuditLogInterceptor = class AuditLogInterceptor {
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const user = request.user;
        const tenantId = user?.tenantId || null;
        const userId = user?.userId || user?.sub || null;
        const ipAddress = request.ip || request.headers['x-forwarded-for'] || request.connection?.remoteAddress;
        const userAgent = request.headers['user-agent'];
        const method = request.method;
        const path = request.originalUrl || request.url;
        const body = sanitizeBody(request.body);
        const entityType = getEntityType(path);
        return next.handle().pipe((0, operators_1.tap)({
            next: async (data) => {
                if (['GET', 'HEAD', 'OPTIONS'].includes(method))
                    return;
                try {
                    await database_1.prisma.auditLog.create({
                        data: {
                            tenantId,
                            userId,
                            action: deriveAuditAction(method, path),
                            entityType,
                            entityId: request.params?.id || body?.id || null,
                            newValues: typeof data === 'object' ? sanitizeBody(data) : null,
                            ipAddress: typeof ipAddress === 'string' ? ipAddress : null,
                            userAgent: typeof userAgent === 'string' ? userAgent : null,
                            httpMethod: method,
                            httpPath: path,
                            requestBody: Object.keys(body || {}).length > 0 ? body : null,
                            responseStatus: response.statusCode,
                        },
                    });
                }
                catch (e) {
                    console.error('Audit log failed:', e);
                }
            },
            error: async (error) => {
                if (['GET', 'HEAD', 'OPTIONS'].includes(method))
                    return;
                try {
                    await database_1.prisma.auditLog.create({
                        data: {
                            tenantId,
                            userId,
                            action: `${deriveAuditAction(method, path)}_ERROR`,
                            entityType,
                            entityId: request.params?.id || body?.id || null,
                            oldValues: { error: error.message, statusCode: error.status },
                            ipAddress: typeof ipAddress === 'string' ? ipAddress : null,
                            userAgent: typeof userAgent === 'string' ? userAgent : null,
                            httpMethod: method,
                            httpPath: path,
                            requestBody: Object.keys(body || {}).length > 0 ? body : null,
                            responseStatus: error.status || 500,
                        },
                    });
                }
                catch (e) {
                    console.error('Audit log failed:', e);
                }
            },
        }));
    }
};
exports.AuditLogInterceptor = AuditLogInterceptor;
exports.AuditLogInterceptor = AuditLogInterceptor = __decorate([
    (0, common_1.Injectable)()
], AuditLogInterceptor);
//# sourceMappingURL=audit-log.interceptor.js.map