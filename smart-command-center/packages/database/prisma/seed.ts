import { PrismaClient, PlanType, TenantStatus, UserStatus, Role } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create Super Admin Tenant
  const superTenant = await prisma.tenant.upsert({
    where: { slug: 'super-admin' },
    update: {},
    create: {
      name: 'Super Admin',
      slug: 'super-admin',
      status: TenantStatus.ACTIVE,
      plan: PlanType.ENTERPRISE,
    },
  })

  // Create default roles
  const roles = [
    { name: 'Super Admin', slug: 'super-admin', isSystem: true },
    { name: 'Admin', slug: 'admin', isSystem: true },
    { name: 'Manager', slug: 'manager', isSystem: true },
    { name: 'Supervisor', slug: 'supervisor', isSystem: true },
    { name: 'Employee', slug: 'employee', isSystem: true },
    { name: 'Viewer', slug: 'viewer', isSystem: true },
  ]

  for (const role of roles) {
    await prisma.role.upsert({
      where: { slug: role.slug },
      update: {},
      create: role,
    })
  }

  // Create Super Admin User
  const superAdminRole = await prisma.role.findUnique({ where: { slug: 'super-admin' } })
  
  if (superAdminRole) {
    await prisma.user.upsert({
      where: { 
        tenantId_email: {
          tenantId: superTenant.id,
          email: 'admin@smartcommand.sa',
        }
      },
      update: {},
      create: {
        tenantId: superTenant.id,
        email: 'admin@smartcommand.sa',
        password: await hash('Admin@123', 12),
        firstName: 'System',
        lastName: 'Administrator',
        status: UserStatus.ACTIVE,
        emailVerified: true,
        roleId: superAdminRole.id,
      },
    })
  }

  // Create demo tenant
  const demoTenant = await prisma.tenant.upsert({
    where: { slug: 'demo-company' },
    update: {},
    create: {
      name: 'شركة تجريبية',
      slug: 'demo-company',
      domain: 'demo.smartcommand.sa',
      status: TenantStatus.ACTIVE,
      plan: PlanType.SHARED,
    },
  })

  // Create subscription for demo tenant
  await prisma.subscription.upsert({
    where: { tenantId: demoTenant.id },
    update: {},
    create: {
      tenantId: demoTenant.id,
      plan: PlanType.SHARED,
      price: 299,
      currency: 'SAR',
      maxUsers: 10,
      maxStorage: 5120,
    },
  })

  console.log('✅ Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
