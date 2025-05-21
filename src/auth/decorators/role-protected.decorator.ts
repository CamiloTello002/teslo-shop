import { SetMetadata } from '@nestjs/common';

// declaring a constant for this prevents typos and mistakes
// it's a single source of truth, and you can change the name of the metadata if you need it
// it can be autocompleted on an IDE, which reduces errors and improves dev speed
// there's more code consistency
export const META_ROLES = 'roles';

export const RoleProtected = (...args: string[]) => {
  return SetMetadata(META_ROLES, args);
}
