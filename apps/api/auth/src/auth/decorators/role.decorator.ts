import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/types/user.types';

export const Role = (role: UserRole) => SetMetadata('role', role);
