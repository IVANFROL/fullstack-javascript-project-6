import Task from '../models/Task.js';
import TaskStatus from '../models/TaskStatus.js';
import User from '../models/User.js';

export const index = async (request, reply) => {
  const tasks = await Task.query()
    .withGraphFetched('[status, creator, executor]')
    .orderBy('id');
  
  return reply.view('tasks/index.pug', {
    tasks,
    t: request.t,
    currentUser: request.currentUser,
  });
};

export const newTask = async (request, reply) => {
  if (!request.currentUser) {
    request.flash('error', 'You must be logged in');
    return reply.redirect('/session/new');
  }
  
  const statuses = await TaskStatus.query().orderBy('id');
  const users = await User.query().orderBy('id');
  
  return reply.view('tasks/new.pug', {
    task: {},
    statuses,
    users,
    t: request.t,
  });
};

export const create = async (request, reply) => {
  if (!request.currentUser) {
    request.flash('error', 'You must be logged in');
    return reply.redirect('/session/new');
  }
  
  try {
    const { data } = request.body;
    await Task.query().insert({
      name: data.name,
      description: data.description || null,
      statusId: Number(data.statusId),
      creatorId: request.currentUser.id,
      executorId: data.executorId ? Number(data.executorId) : null,
    });
    request.flash('success', 'Task has been created');
    return reply.redirect('/tasks');
  } catch (error) {
    request.flash('error', error.message || 'Failed to create task');
    return reply.redirect('/tasks/new');
  }
};

export const show = async (request, reply) => {
  const { id } = request.params;
  const task = await Task.query()
    .findById(id)
    .withGraphFetched('[status, creator, executor]');
  
  if (!task) {
    request.flash('error', 'Task not found');
    return reply.redirect('/tasks');
  }
  
  return reply.view('tasks/show.pug', {
    task,
    t: request.t,
    currentUser: request.currentUser,
  });
};

export const edit = async (request, reply) => {
  if (!request.currentUser) {
    request.flash('error', 'You must be logged in');
    return reply.redirect('/session/new');
  }
  
  const { id } = request.params;
  const task = await Task.query()
    .findById(id)
    .withGraphFetched('[status, creator]');
  
  if (!task) {
    request.flash('error', 'Task not found');
    return reply.redirect('/tasks');
  }
  
  const statuses = await TaskStatus.query().orderBy('id');
  const users = await User.query().orderBy('id');
  
  return reply.view('tasks/edit.pug', {
    task,
    statuses,
    users,
    t: request.t,
  });
};

export const update = async (request, reply) => {
  if (!request.currentUser) {
    request.flash('error', 'You must be logged in');
    return reply.redirect('/session/new');
  }
  
  try {
    const { id } = request.params;
    const { data } = request.body;
    
    const task = await Task.query().findById(id);
    if (!task) {
      request.flash('error', 'Task not found');
      return reply.redirect('/tasks');
    }
    
    await Task.query().findById(id).patch({
      name: data.name,
      description: data.description || null,
      statusId: Number(data.statusId),
      executorId: data.executorId ? Number(data.executorId) : null,
    });
    request.flash('success', 'Task has been updated');
    return reply.redirect('/tasks');
  } catch (error) {
    request.flash('error', error.message || 'Failed to update task');
    return reply.redirect(`/tasks/${request.params.id}/edit`);
  }
};

export const destroy = async (request, reply) => {
  const { id } = request.params;
  const currentUser = request.currentUser;
  
  if (!currentUser) {
    request.flash('error', 'You must be logged in');
    return reply.redirect('/session/new');
  }
  
  try {
    const task = await Task.query().findById(id);
    
    if (!task) {
      request.flash('error', 'Task not found');
      return reply.redirect('/tasks');
    }
    
    if (task.creatorId !== currentUser.id) {
      request.flash('error', 'Only the creator can delete the task');
      return reply.redirect('/tasks');
    }
    
    await Task.query().deleteById(id);
    request.flash('success', 'Task has been deleted');
    return reply.redirect('/tasks');
  } catch (error) {
    request.flash('error', error.message || 'Failed to delete task');
    return reply.redirect('/tasks');
  }
};
