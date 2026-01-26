import { registerEnumType } from "@nestjs/graphql";

//TODO: Implementar enum como GraphQL Enum Type
export enum ValidRoles {
  ADMIN = 'admin',
  USER = 'user',
  SUPER_USER = 'superUser',
}

registerEnumType(ValidRoles, { name: 'ValidRoles', description: 'Roles validos en el sistema' });