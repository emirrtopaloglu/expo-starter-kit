export const userMutations = {
  create: () => ['createUser'] as const,
  update: (id: string) => ['updateUser', id] as const,
  delete: (id: string) => ['deleteUser', id] as const,
};
