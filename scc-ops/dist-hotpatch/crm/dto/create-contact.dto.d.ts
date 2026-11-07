export declare const CONTACT_TYPES: readonly ["CUSTOMER", "LEAD", "PROSPECT", "PARTNER", "SUPPLIER", "VENDOR"];
export declare const CONTACT_STATUSES: readonly ["ACTIVE", "INACTIVE", "CONVERTED", "BLACKLISTED"];
export declare class CreateContactDto {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    phone2?: string;
    companyName?: string;
    jobTitle?: string;
    idNumber?: string;
    vatNumber?: string;
    crNumber?: string;
    address?: string;
    city?: string;
    region?: string;
    country?: string;
    type?: string;
    status?: string;
    tenantId?: string;
}
//# sourceMappingURL=create-contact.dto.d.ts.map