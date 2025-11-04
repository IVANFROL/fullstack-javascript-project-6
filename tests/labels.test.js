import { describe, it, beforeAll, afterAll, expect } from '@jest/globals';
import { knex } from '../src/lib/db.js';
import Label from '../src/models/Label.js';
import Task from '../src/models/Task.js';
import User from '../src/models/User.js';
import TaskStatus from '../src/models/TaskStatus.js';

describe('Labels CRUD', () => {
  let testUser;
  let testStatus;

  beforeAll(async () => {
    await knex.migrate.latest();
    
    testUser = await User.query().insert({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123',
    });
    
    testStatus = await TaskStatus.query().insert({
      name: 'New',
    });
  });

  afterAll(async () => {
    await knex.migrate.rollback();
    await knex.destroy();
  });

  describe('Create', () => {
    it('should create a new label', async () => {
      const labelData = {
        name: 'bug',
      };

      const label = await Label.query().insert(labelData);
      
      expect(label).toBeDefined();
      expect(label.name).toBe(labelData.name);
    });

    it('should not create label with empty name', async () => {
      const labelData = {
        name: '',
      };

      await expect(Label.query().insert(labelData)).rejects.toThrow();
    });

    it('should not create label without name', async () => {
      const labelData = {};

      await expect(Label.query().insert(labelData)).rejects.toThrow();
    });
  });

  describe('Read', () => {
    it('should find label by id', async () => {
      const labelData = {
        name: 'Find Label',
      };

      const created = await Label.query().insert(labelData);
      const found = await Label.query().findById(created.id);

      expect(found).toBeDefined();
      expect(found.name).toBe(labelData.name);
    });

    it('should list all labels', async () => {
      const labelData1 = {
        name: 'Label 1',
      };
      
      const labelData2 = {
        name: 'Label 2',
      };

      await Label.query().insert(labelData1);
      await Label.query().insert(labelData2);
      
      const labels = await Label.query().orderBy('id');
      expect(labels.length).toBeGreaterThanOrEqual(2);
      const names = labels.map(l => l.name);
      expect(names).toContain(labelData1.name);
      expect(names).toContain(labelData2.name);
    });
  });

  describe('Update', () => {
    it('should update label', async () => {
      const labelData = {
        name: 'Original Label',
      };

      const label = await Label.query().insert(labelData);
      const updated = await Label.query().patchAndFetchById(label.id, {
        name: 'Updated Label',
      });

      expect(updated.name).toBe('Updated Label');
    });
  });

  describe('Delete', () => {
    it('should delete label', async () => {
      const labelData = {
        name: 'Label To Delete',
      };

      const label = await Label.query().insert(labelData);
      await Label.query().deleteById(label.id);
      
      const found = await Label.query().findById(label.id);
      expect(found).toBeUndefined();
    });
  });

  describe('Many-to-Many relation with Tasks', () => {
    it('should relate label to task', async () => {
      const label = await Label.query().insert({ name: 'Feature' });
      const task = await Task.query().insert({
        name: 'Test Task',
        statusId: testStatus.id,
        creatorId: testUser.id,
      });

      await task.$relatedQuery('labels').relate(label.id);
      
      const taskWithLabels = await Task.query()
        .findById(task.id)
        .withGraphFetched('labels');
      
      expect(taskWithLabels.labels).toBeDefined();
      expect(taskWithLabels.labels.length).toBe(1);
      expect(taskWithLabels.labels[0].id).toBe(label.id);
    });

    it('should load labels with tasks', async () => {
      const label = await Label.query().insert({ name: 'Bug' });
      const task = await Task.query().insert({
        name: 'Another Task',
        statusId: testStatus.id,
        creatorId: testUser.id,
      });

      await task.$relatedQuery('labels').relate(label.id);
      
      const labelWithTasks = await Label.query()
        .findById(label.id)
        .withGraphFetched('tasks');
      
      expect(labelWithTasks.tasks).toBeDefined();
      expect(labelWithTasks.tasks.length).toBe(1);
      expect(labelWithTasks.tasks[0].id).toBe(task.id);
    });
  });
});
