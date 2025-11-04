import { describe, it, beforeAll, afterAll, expect } from '@jest/globals';
import app from '../src/index.js';
import User from '../src/models/User.js';
import { knex } from '../src/lib/db.js';

describe('Users CRUD', () => {
  beforeAll(async () => {
    await knex.migrate.latest();
  });

  afterAll(async () => {
    await knex.migrate.rollback();
    await knex.destroy();
  });

  describe('Create', () => {
    it('should create a new user', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const user = await User.query().insert(userData);
      
      expect(user).toBeDefined();
      expect(user.firstName).toBe(userData.firstName);
      expect(user.lastName).toBe(userData.lastName);
      expect(user.email).toBe(userData.email);
      expect(user.password).not.toBe(userData.password); // Should be hashed
    });

    it('should not create user with invalid email', async () => {
      const userData = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'invalid-email',
        password: 'password123',
      };

      await expect(User.query().insert(userData)).rejects.toThrow();
    });

    it('should not create user with short password', async () => {
      const userData = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        password: '12',
      };

      await expect(User.query().insert(userData)).rejects.toThrow();
    });
  });

  describe('Read', () => {
    it('should find user by id', async () => {
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
      };

      const created = await User.query().insert(userData);
      const found = await User.query().findById(created.id);

      expect(found).toBeDefined();
      expect(found.email).toBe(userData.email);
    });

    it('should list all users', async () => {
      const userData1 = {
        firstName: 'List',
        lastName: 'User1',
        email: 'list1@example.com',
        password: 'password123',
      };
      
      const userData2 = {
        firstName: 'List',
        lastName: 'User2',
        email: 'list2@example.com',
        password: 'password123',
      };

      await User.query().insert(userData1);
      await User.query().insert(userData2);
      
      const users = await User.query();
      expect(users.length).toBeGreaterThanOrEqual(2);
      const emails = users.map(u => u.email);
      expect(emails).toContain(userData1.email);
      expect(emails).toContain(userData2.email);
    });
  });

  describe('Update', () => {
    it('should update user', async () => {
      const userData = {
        firstName: 'Original',
        lastName: 'Name',
        email: 'original@example.com',
        password: 'password123',
      };

      const user = await User.query().insert(userData);
      const updated = await User.query().patchAndFetchById(user.id, {
        firstName: 'Updated',
        lastName: 'Name',
      });

      expect(updated.firstName).toBe('Updated');
      expect(updated.email).toBe(userData.email);
    });

    it('should hash password on update', async () => {
      const userData = {
        firstName: 'Password',
        lastName: 'Test',
        email: 'password@example.com',
        password: 'oldpassword',
      };

      const user = await User.query().insert(userData);
      const oldPassword = user.password;
      
      await User.query().findById(user.id).patch({
        password: 'newpassword',
      });

      const updated = await User.query().findById(user.id);
      expect(updated.password).not.toBe(oldPassword);
      expect(updated.password).not.toBe('newpassword');
    });
  });

  describe('Delete', () => {
    it('should delete user', async () => {
      const userData = {
        firstName: 'Delete',
        lastName: 'Me',
        email: 'delete@example.com',
        password: 'password123',
      };

      const user = await User.query().insert(userData);
      await User.query().deleteById(user.id);
      
      const found = await User.query().findById(user.id);
      expect(found).toBeUndefined();
    });
  });

  describe('Password verification', () => {
    it('should verify correct password', async () => {
      const userData = {
        firstName: 'Verify',
        lastName: 'Password',
        email: 'verify@example.com',
        password: 'correctpassword',
      };

      const user = await User.query().insert(userData);
      const isValid = await user.verifyPassword('correctpassword');
      
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const userData = {
        firstName: 'Verify',
        lastName: 'Password',
        email: 'verify2@example.com',
        password: 'correctpassword',
      };

      const user = await User.query().insert(userData);
      const isValid = await user.verifyPassword('wrongpassword');
      
      expect(isValid).toBe(false);
    });
  });
});
