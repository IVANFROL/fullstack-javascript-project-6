import { describe, it, beforeAll, afterAll, expect } from '@jest/globals';
import { knex } from '../src/lib/db.js';
import TaskStatus from '../src/models/TaskStatus.js';

describe('Statuses CRUD', () => {
  beforeAll(async () => {
    await knex.migrate.latest();
  });

  afterAll(async () => {
    await knex.migrate.rollback();
    await knex.destroy();
  });

  describe('Create', () => {
    it('should create a new status', async () => {
      const statusData = {
        name: 'New',
      };

      const status = await TaskStatus.query().insert(statusData);
      
      expect(status).toBeDefined();
      expect(status.name).toBe(statusData.name);
    });

    it('should not create status with empty name', async () => {
      const statusData = {
        name: '',
      };

      await expect(TaskStatus.query().insert(statusData)).rejects.toThrow();
    });

    it('should not create status without name', async () => {
      const statusData = {};

      await expect(TaskStatus.query().insert(statusData)).rejects.toThrow();
    });
  });

  describe('Read', () => {
    it('should find status by id', async () => {
      const statusData = {
        name: 'In Progress',
      };

      const created = await TaskStatus.query().insert(statusData);
      const found = await TaskStatus.query().findById(created.id);

      expect(found).toBeDefined();
      expect(found.name).toBe(statusData.name);
    });

    it('should list all statuses', async () => {
      const statusData1 = {
        name: 'Testing',
      };
      
      const statusData2 = {
        name: 'Done',
      };

      await TaskStatus.query().insert(statusData1);
      await TaskStatus.query().insert(statusData2);
      
      const statuses = await TaskStatus.query().orderBy('id');
      expect(statuses.length).toBeGreaterThanOrEqual(2);
      const names = statuses.map(s => s.name);
      expect(names).toContain(statusData1.name);
      expect(names).toContain(statusData2.name);
    });
  });

  describe('Update', () => {
    it('should update status', async () => {
      const statusData = {
        name: 'Original',
      };

      const status = await TaskStatus.query().insert(statusData);
      const updated = await TaskStatus.query().patchAndFetchById(status.id, {
        name: 'Updated',
      });

      expect(updated.name).toBe('Updated');
      expect(updated.id).toBe(status.id);
    });

    it('should not update status with empty name', async () => {
      const statusData = {
        name: 'Valid Name',
      };

      const status = await TaskStatus.query().insert(statusData);
      
      await expect(
        TaskStatus.query().patchAndFetchById(status.id, { name: '' })
      ).rejects.toThrow();
    });
  });

  describe('Delete', () => {
    it('should delete status', async () => {
      const statusData = {
        name: 'To Delete',
      };

      const status = await TaskStatus.query().insert(statusData);
      await TaskStatus.query().deleteById(status.id);
      
      const found = await TaskStatus.query().findById(status.id);
      expect(found).toBeUndefined();
    });
  });
});
