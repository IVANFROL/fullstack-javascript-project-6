import { describe, it, beforeAll, afterAll, expect } from '@jest/globals';
import { knex } from '../src/lib/db.js';
import Task from '../src/models/Task.js';
import User from '../src/models/User.js';
import TaskStatus from '../src/models/TaskStatus.js';

describe('Tasks CRUD', () => {
  let testUser;
  let testStatus;
  let testUser2;

  beforeAll(async () => {
    await knex.migrate.latest();
    
    // Создаем тестового пользователя и статус
    testUser = await User.query().insert({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123',
    });
    
    testUser2 = await User.query().insert({
      firstName: 'Test2',
      lastName: 'User2',
      email: 'test2@example.com',
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
    it('should create a new task', async () => {
      const taskData = {
        name: 'Test Task',
        description: 'Test description',
        statusId: testStatus.id,
        creatorId: testUser.id,
        executorId: testUser2.id,
      };

      const task = await Task.query().insert(taskData);
      
      expect(task).toBeDefined();
      expect(task.name).toBe(taskData.name);
      expect(task.description).toBe(taskData.description);
      expect(task.statusId).toBe(taskData.statusId);
      expect(task.creatorId).toBe(taskData.creatorId);
      expect(task.executorId).toBe(taskData.executorId);
    });

    it('should create task without description and executor', async () => {
      const taskData = {
        name: 'Task Without Optional',
        statusId: testStatus.id,
        creatorId: testUser.id,
      };

      const task = await Task.query().insert(taskData);
      
      expect(task).toBeDefined();
      expect(task.name).toBe(taskData.name);
      expect(task.description).toBeFalsy();
      expect(task.executorId).toBeFalsy();
    });

    it('should not create task with empty name', async () => {
      const taskData = {
        name: '',
        statusId: testStatus.id,
        creatorId: testUser.id,
      };

      await expect(Task.query().insert(taskData)).rejects.toThrow();
    });

    it('should not create task without required fields', async () => {
      const taskData = {
        name: 'Task',
      };

      await expect(Task.query().insert(taskData)).rejects.toThrow();
    });
  });

  describe('Read', () => {
    it('should find task by id', async () => {
      const taskData = {
        name: 'Find Task',
        statusId: testStatus.id,
        creatorId: testUser.id,
      };

      const created = await Task.query().insert(taskData);
      const found = await Task.query().findById(created.id);

      expect(found).toBeDefined();
      expect(found.name).toBe(taskData.name);
    });

    it('should load task with relations', async () => {
      const taskData = {
        name: 'Task With Relations',
        statusId: testStatus.id,
        creatorId: testUser.id,
        executorId: testUser2.id,
      };

      const created = await Task.query().insert(taskData);
      const found = await Task.query()
        .findById(created.id)
        .withGraphFetched('[status, creator, executor]');

      expect(found).toBeDefined();
      expect(found.status).toBeDefined();
      expect(found.status.name).toBe(testStatus.name);
      expect(found.creator).toBeDefined();
      expect(found.executor).toBeDefined();
    });

    it('should list all tasks', async () => {
      const taskData1 = {
        name: 'Task 1',
        statusId: testStatus.id,
        creatorId: testUser.id,
      };
      
      const taskData2 = {
        name: 'Task 2',
        statusId: testStatus.id,
        creatorId: testUser.id,
      };

      await Task.query().insert(taskData1);
      await Task.query().insert(taskData2);
      
      const tasks = await Task.query().orderBy('id');
      expect(tasks.length).toBeGreaterThanOrEqual(2);
      const names = tasks.map(t => t.name);
      expect(names).toContain(taskData1.name);
      expect(names).toContain(taskData2.name);
    });
  });

  describe('Update', () => {
    it('should update task', async () => {
      const taskData = {
        name: 'Original Task',
        statusId: testStatus.id,
        creatorId: testUser.id,
      };

      const task = await Task.query().insert(taskData);
      const updated = await Task.query().patchAndFetchById(task.id, {
        name: 'Updated Task',
        description: 'Updated description',
      });

      expect(updated.name).toBe('Updated Task');
      expect(updated.description).toBe('Updated description');
    });

    it('should update task executor', async () => {
      const taskData = {
        name: 'Task For Executor Update',
        statusId: testStatus.id,
        creatorId: testUser.id,
      };

      const task = await Task.query().insert(taskData);
      const updated = await Task.query().patchAndFetchById(task.id, {
        executorId: testUser2.id,
      });

      expect(updated.executorId).toBe(testUser2.id);
    });
  });

  describe('Delete', () => {
    it('should delete task', async () => {
      const taskData = {
        name: 'Task To Delete',
        statusId: testStatus.id,
        creatorId: testUser.id,
      };

      const task = await Task.query().insert(taskData);
      await Task.query().deleteById(task.id);
      
      const found = await Task.query().findById(task.id);
      expect(found).toBeUndefined();
    });
  });
});
