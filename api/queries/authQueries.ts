export const authQueries = {
  all: () => ['auth'] as const,
  session: () => [...authQueries.all(), 'session'] as const,
};
