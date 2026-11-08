export const toSql = (vector: number[] | Float32Array): string =>
    JSON.stringify(Array.from(vector));