import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(
    @Inject('DRIZZLE')
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.findByEmail(createUserDto.email);

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const [user] = await this.db.insert(schema.users).values(createUserDto).returning();
    return user;
  }

  async findAll() {
    return this.db.select().from(schema.users);
  }

  async findOne(id: string) {
    const [user] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id));

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return user;
  }

  async findByEmail(email: string) {
    const [user] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email));

    return user || null;
  }

  async update(id: string, updateData: Partial<typeof schema.users.$inferSelect>) {
    await this.findOne(id); // Check if user exists

    const [updatedUser] = await this.db
      .update(schema.users)
      .set(updateData)
      .where(eq(schema.users.id, id))
      .returning();

    return updatedUser;
  }

  async remove(id: string) {
    await this.findOne(id); // Check if user exists

    const [deletedUser] = await this.db
      .delete(schema.users)
      .where(eq(schema.users.id, id))
      .returning();

    return deletedUser;
  }

  async verifyEmail(id: string) {
    const user = await this.findOne(id);
    user.isEmailVerified = 'true';
    const [updatedUser] = await this.db
      .update(schema.users)
      .set({ isEmailVerified: 'true' })
      .where(eq(schema.users.id, id))
      .returning();
    return updatedUser;
  }

  async updatePassword(id: string, newPassword: string) {
    const user = await this.findOne(id);
    user.password = newPassword;
    const [updatedUser] = await this.db
      .update(schema.users)
      .set({ password: newPassword })
      .where(eq(schema.users.id, id))
      .returning();
    return updatedUser;
  }
}
