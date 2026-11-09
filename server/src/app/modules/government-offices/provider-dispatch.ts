import {
  DispatchOutcome,
  NormalizedOffice,
  OfficeProvider,
  OfficeServiceMode,
  ProviderError,
  ProviderExecutionRecord,
  ServiceDefinition,
} from "./office-provider.types";
import {
  OfficeProviderRegistry,
  officeProviderRegistry,
} from "./provider-registry";

type DispatchParams =
  | { lat: number; lng: number; radiusKm: number }
  | {
      district: string;
      districtBn?: string;
      upazila?: string;
      upazilaBn?: string;
    };

export interface DispatchInput {
  serviceDefinition: ServiceDefinition;
  mode: OfficeServiceMode;
  params: DispatchParams;
}

function runProvider(
  provider: OfficeProvider,
  mode: OfficeServiceMode,
  params: DispatchParams,
): Promise<NormalizedOffice[]> {
  if (mode === "area") {
    return provider.findByArea(
      params as {
        district: string;
        districtBn?: string;
        upazila?: string;
        upazilaBn?: string;
      },
    );
  }
  return provider.findNearby(
    params as { lat: number; lng: number; radiusKm: number },
  );
}

/**
 * Executes the configured provider selection policy for a service and returns
 * a structured DispatchOutcome. Provider identity is always the stable
 * providerId; registry order is never used as implicit priority.
 */
export async function dispatchOfficeSearch(
  input: DispatchInput,
  registry: OfficeProviderRegistry = officeProviderRegistry,
): Promise<DispatchOutcome> {
  const { serviceDefinition, mode, params } = input;
  const family = serviceDefinition.family;

  const providers = registry.getProviders(family);

  if (providers.length === 0) {
    return {
      outcome: "missing-config",
      offices: [],
      executions: [],
      errors: [],
    };
  }

  const primaryIds = serviceDefinition.primaryProviderIds ?? [];
  const stopOnEmpty = serviceDefinition.stopOnEmpty ?? false;
  const policy = serviceDefinition.providerSelectionPolicy ?? "primary-only";

  // Primary providers first (in configured order), then the remaining
  // providers. Registry order is never used as implicit priority.
  const ordered = [...providers].sort(
    (a, b) =>
      Number(primaryIds.includes(b.providerId)) -
      Number(primaryIds.includes(a.providerId)),
  );

  const executions: ProviderExecutionRecord[] = [];
  const errors: ProviderError[] = [];
  const offices: NormalizedOffice[] = [];

  for (const provider of ordered) {
    let result: NormalizedOffice[];
    try {
      result = await runProvider(provider, mode, params);
    } catch (cause) {
      executions.push({
        providerId: provider.providerId,
        success: false,
        officeCount: 0,
        cause,
      });
      errors.push({
        kind: "provider-error",
        providerId: provider.providerId,
        cause,
      });
      continue;
    }

    executions.push({
      providerId: provider.providerId,
      success: true,
      officeCount: result.length,
    });

    if (result.length > 0) {
      offices.push(...result);
      // primary-only and fallback stop at the first provider that yields offices.
      if (policy !== "aggregate") {
        return { outcome: "success", offices, executions, errors };
      }
      continue;
    }

    // Empty success from this provider.
    if (stopOnEmpty) {
      return { outcome: "empty", offices, executions, errors };
    }
    // Otherwise fall through to the next provider (fallback).
  }

  if (offices.length > 0) {
    return { outcome: "success", offices, executions, errors };
  }
  if (errors.length > 0 && executions.some((e) => e.success)) {
    return { outcome: "partial", offices: [], executions, errors };
  }
  if (errors.length === ordered.length) {
    return { outcome: "complete-failure", offices: [], executions, errors };
  }
  return { outcome: "empty", offices: [], executions, errors };
}
