import type { OfficeProvider, OfficeFamily } from "./office-provider.types";

/** Provider registry - manages registered providers by family. */
export class OfficeProviderRegistry {
  private providers = new Map<OfficeFamily, OfficeProvider[]>();

  /** Register a provider. Duplicate providerId values are not allowed. */
  register(provider: OfficeProvider): void {
    if (this.hasProvider(provider.providerId)) {
      throw new Error(`Duplicate providerId: ${provider.providerId}`);
    }

    const existing = this.providers.get(provider.family);

    if (!existing) {
      this.providers.set(provider.family, [provider]);
    } else {
      existing.push(provider);
    }
  }

  /** Get all providers for a family. */
  getProviders(family: OfficeFamily): OfficeProvider[] {
    return this.providers.get(family) ?? [];
  }

  /** Get a single provider by ID, or undefined if not found. */
  getProvider(providerId: string): OfficeProvider | undefined {
    for (const familyProviders of this.providers.values()) {
      const provider = familyProviders.find(
        (item) => item.providerId === providerId,
      );

      if (provider) {
        return provider;
      }
    }

    return undefined;
  }

  /** Get all registered provider IDs. */
  getAllProviderIds(): string[] {
    const ids: string[] = [];

    for (const familyProviders of this.providers.values()) {
      for (const provider of familyProviders) {
        ids.push(provider.providerId);
      }
    }

    return ids;
  }

  /** Check if a provider ID exists. */
  hasProvider(providerId: string): boolean {
    return this.getProvider(providerId) !== undefined;
  }
}

/** Singleton provider registry used by the dispatcher and service layer. */
export const officeProviderRegistry = new OfficeProviderRegistry();
