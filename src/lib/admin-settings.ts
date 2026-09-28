import { prisma } from './prisma';

export type BusinessInfoValues = {
  companyName: string;
  registrationNumber: string;
  tagline: string;
  description: string;
  aboutText: string;
  businessHours: string;
};

export async function getBusinessInfo(): Promise<BusinessInfoValues> {
  const row = await prisma.businessInformation.findUnique({ where: { id: 'singleton' } });
  return {
    companyName: row?.companyName ?? 'BUSINESS-HUB COMPUTERS',
    registrationNumber: row?.registrationNumber ?? '',
    tagline: row?.tagline ?? '',
    description: row?.description ?? '',
    aboutText: row?.aboutText ?? '',
    businessHours: row?.businessHours ?? ''
  };
}

export async function updateBusinessInfo(input: BusinessInfoValues) {
  await prisma.businessInformation.upsert({
    where: { id: 'singleton' },
    update: {
      companyName: input.companyName.trim(),
      registrationNumber: input.registrationNumber.trim(),
      tagline: input.tagline.trim() || null,
      description: input.description.trim() || null,
      aboutText: input.aboutText.trim() || null,
      businessHours: input.businessHours.trim() || null
    },
    create: {
      id: 'singleton',
      companyName: input.companyName.trim(),
      registrationNumber: input.registrationNumber.trim(),
      tagline: input.tagline.trim() || null,
      description: input.description.trim() || null,
      aboutText: input.aboutText.trim() || null,
      businessHours: input.businessHours.trim() || null
    }
  });
}

export type ContactInfoValues = {
  primaryPhone: string;
  secondaryPhone: string;
  whatsappNumber: string;
  email: string;
  supportEmail: string;
  address: string;
  branchAddress: string;
  openingHours: string;
  mapsLink: string;
};

export async function getContactInfo(): Promise<ContactInfoValues> {
  const row = await prisma.contactInformation.findUnique({ where: { id: 'singleton' } });
  return {
    primaryPhone: row?.primaryPhone ?? '',
    secondaryPhone: row?.secondaryPhone ?? '',
    whatsappNumber: row?.whatsappNumber ?? '',
    email: row?.email ?? '',
    supportEmail: row?.supportEmail ?? '',
    address: row?.address ?? '',
    branchAddress: row?.branchAddress ?? '',
    openingHours: row?.openingHours ?? '',
    mapsLink: row?.mapsLink ?? ''
  };
}

export async function updateContactInfo(input: ContactInfoValues) {
  const data = {
    primaryPhone: input.primaryPhone.trim() || null,
    secondaryPhone: input.secondaryPhone.trim() || null,
    whatsappNumber: input.whatsappNumber.trim() || null,
    email: input.email.trim() || null,
    supportEmail: input.supportEmail.trim() || null,
    address: input.address.trim() || null,
    branchAddress: input.branchAddress.trim() || null,
    openingHours: input.openingHours.trim() || null,
    mapsLink: input.mapsLink.trim() || null
  };
  await prisma.contactInformation.upsert({
    where: { id: 'singleton' },
    update: data,
    create: { id: 'singleton', ...data }
  });
}

export type SocialLinkValue = { id: string; platform: string; url: string; isActive: boolean };

export async function listSocialLinks(): Promise<SocialLinkValue[]> {
  const rows = await prisma.socialLink.findMany({ orderBy: { sortOrder: 'asc' } });
  return rows.map((r: (typeof rows)[number]) => ({ id: r.id, platform: r.platform, url: r.url, isActive: r.isActive }));
}

export async function updateSocialLinks(links: { id: string; url: string; isActive: boolean }[]) {
  await Promise.all(
    links.map((link) =>
      prisma.socialLink.update({
        where: { id: link.id },
        data: { url: link.url.trim(), isActive: link.isActive && link.url.trim().length > 0 }
      })
    )
  );
}
