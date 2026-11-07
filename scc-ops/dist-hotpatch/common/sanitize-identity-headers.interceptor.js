"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SanitizeIdentityHeadersInterceptor = void 0;
const common_1 = require("@nestjs/common");
/**
 * تعقيم هوية الطلب بعد نجاح JWT:
 * يمنع انتحال x-tenant-id / x-user-role القادم من العميل، ويملؤها من req.user (موقّع).
 * يعمل بعد JwtAuthGuard — أي طلب غير موثق لا يصل إليه أصلًا.
 * الطلبات العامة (public) لا تملك req.user فتُترك رؤوسها كما هي (لا تقرأها خدمات عامة).
 */
let SanitizeIdentityHeadersInterceptor = class SanitizeIdentityHeadersInterceptor {
    intercept(context, next) {
        const req = context.switchToHttp().getRequest();
        if (req.user) {
            if (req.headers) {
                req.headers['x-tenant-id'] = req.user.tenantId ?? '';
                req.headers['x-user-role'] = req.user.role ?? '';
                req.headers['x-branch-id'] = req.headers['x-branch-id'] || '';
            }
            // قيم مكررة يقرأها بعض الكنترولرات من الاستعلام/الجسم
            req.tenantId = req.user.tenantId;
            req.userRole = req.user.role;
        }
        return next.handle();
    }
};
exports.SanitizeIdentityHeadersInterceptor = SanitizeIdentityHeadersInterceptor;
exports.SanitizeIdentityHeadersInterceptor = SanitizeIdentityHeadersInterceptor = __decorate([
    (0, common_1.Injectable)()
], SanitizeIdentityHeadersInterceptor);
//# sourceMappingURL=sanitize-identity-headers.interceptor.js.map