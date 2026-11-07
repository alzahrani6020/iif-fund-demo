import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
/**
 * تعقيم هوية الطلب بعد نجاح JWT:
 * يمنع انتحال x-tenant-id / x-user-role القادم من العميل، ويملؤها من req.user (موقّع).
 * يعمل بعد JwtAuthGuard — أي طلب غير موثق لا يصل إليه أصلًا.
 * الطلبات العامة (public) لا تملك req.user فتُترك رؤوسها كما هي (لا تقرأها خدمات عامة).
 */
export declare class SanitizeIdentityHeadersInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown>;
}
//# sourceMappingURL=sanitize-identity-headers.interceptor.d.ts.map