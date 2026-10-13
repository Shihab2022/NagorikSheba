import { pool } from "../../utils/pg";
import type {
    CreateServicePayload,
  Service,
  ServiceCategory,
  ServiceFee,
  ServiceRequirement,
  ServiceSource,
  ServiceStep,
} from "./service.interface";



const createService = async (
  payload: CreateServicePayload,
): Promise<Service> => {
  const {
    categoryId,
    name,
    slug,
    shortDescription,
    description,
    eligibility,
    processingTime,
    officialUrl,
  } = payload;

  const result = await pool.query(
    `INSERT INTO services (
       "categoryId",
       name,
       slug,
       "shortDescription",
       description,
       eligibility,
       "processingTime",
       "officialUrl"
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      categoryId,
      name,
      slug,
      shortDescription,
      description,
      eligibility ?? null,
      processingTime ?? null,
      officialUrl ?? null,
    ],
  );

  return result.rows[0] as Service;
};





const getAllServices = async (): Promise<Service[]> => {
  const result = await pool.query(
    `SELECT
       s.*,
       json_build_object(
         'id', c.id,
         'name', c.name,
         'slug', c.slug,
         'description', c.description,
         'icon', c.icon
       ) AS category
     FROM services AS s
     INNER JOIN category AS c
       ON c.id = s."categoryId"
     WHERE s."isDeleted" = FALSE
       AND s."isPublished" = TRUE
       AND c."isDeleted" = FALSE
     ORDER BY s."createdAt" DESC`,
  );

  return Promise.all(
    (result.rows as Service[]).map(async (service) => {
      const details = await getServiceDetails(service.id);

      return {
        ...service,
        ...details,
      };
    }),
  );
};

const getServiceBySlug = async (
  slug: string,
): Promise<Service | null> => {
  const result = await pool.query(
    `SELECT
       s.*,
       json_build_object(
         'id', c.id,
         'name', c.name,
         'slug', c.slug,
         'description', c.description,
         'icon', c.icon
       ) AS category
     FROM services AS s
     INNER JOIN category AS c
       ON c.id = s."categoryId"
     WHERE s.slug = $1
       AND s."isDeleted" = FALSE
       AND s."isPublished" = TRUE
       AND c."isDeleted" = FALSE
     LIMIT 1`,
    [slug],
  );

  const service = result.rows[0] as Service | undefined;

  if (!service) {
    return null;
  }

  const details = await getServiceDetails(service.id);

  return {
    ...service,
    ...details,
  };
};

const getServicesByCategory = async (
  categorySlug: string,
): Promise<Service[]> => {
  const result = await pool.query(
    `SELECT
       s.*,
       json_build_object(
         'id', c.id,
         'name', c.name,
         'slug', c.slug,
         'description', c.description,
         'icon', c.icon
       ) AS category
     FROM services AS s
     INNER JOIN category AS c
       ON c.id = s."categoryId"
     WHERE c.slug = $1
       AND c."isDeleted" = FALSE
       AND s."isDeleted" = FALSE
       AND s."isPublished" = TRUE
     ORDER BY s."createdAt" DESC`,
    [categorySlug],
  );

  return Promise.all(
    (result.rows as Service[]).map(async (service) => {
      const details = await getServiceDetails(service.id);

      return {
        ...service,
        ...details,
      };
    }),
  );
};

const getServiceDetails = async (
  serviceId: string,
): Promise<
  Pick<Service, "requirements" | "steps" | "fees" | "sources">
> => {
  const [requirementsResult, stepsResult, feesResult, sourcesResult] =
    await Promise.all([
      pool.query(
        `SELECT
           id,
           "serviceId",
           name,
           description,
           "isMandatory",
           "conditionDescription",
           "sortOrder"
         FROM servicerequirement
         WHERE "serviceId" = $1
           AND "isDeleted" = FALSE
         ORDER BY "sortOrder" ASC`,
        [serviceId],
      ),

      pool.query(
        `SELECT
           id,
           "serviceId",
           "stepNumber",
           title,
           description,
           "actionType",
           "officialUrl"
         FROM servicestep
         WHERE "serviceId" = $1
           AND "isDeleted" = FALSE
         ORDER BY "stepNumber" ASC`,
        [serviceId],
      ),

      pool.query(
        `SELECT
           id,
           "serviceId",
           name,
           amount,
           currency,
           description,
           "effectiveFrom",
           "effectiveUntil"
         FROM servicefee
         WHERE "serviceId" = $1
           AND "isDeleted" = FALSE
         ORDER BY "createdAt" DESC`,
        [serviceId],
      ),

      pool.query(
        `SELECT
           id,
           "serviceId",
           title,
           url,
           "sourceType",
           "lastCheckedAt"
         FROM servicesource
         WHERE "serviceId" = $1
           AND "isDeleted" = FALSE
         ORDER BY "createdAt" DESC`,
        [serviceId],
      ),
    ]);

  return {
    requirements: requirementsResult.rows as ServiceRequirement[],
    steps: stepsResult.rows as ServiceStep[],
    fees: feesResult.rows as ServiceFee[],
    sources: sourcesResult.rows as ServiceSource[],
  };
};

export const ServiceService = {
  getAllServices,
  getServiceBySlug,
  getServicesByCategory,
  createService
};