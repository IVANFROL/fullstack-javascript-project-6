import Task from '../models/Task.js';
import TaskStatus from '../models/TaskStatus.js';
import User from '../models/User.js';
import Label from '../models/Label.js';

export const index = async (request, reply) => {
  const { status, executor, label, isCreatorUser } = request.query;
  
  let query = Task.query()
    .withGraphJoined('[status, creator, executor, labels]')
    .orderBy('id');
  
  // Фильтр по статусу
  if (status) {
    query = query.where('statusId', Number(status));
  }
  
  // Фильтр по исполнителю
  if (executor) {
    query = query.where('executorId', Number(executor));
  }
  
  // Фильтр по метке
  if (label) {
    query = query.whereExists(function() {
      this.select('*')
        .from('task_labels')
        .whereRaw('task_labels.taskId = tasks.id')
        .where('task_labels.labelId', Number(label));
    });
  }
  
  // Фильтр по автору (только задачи текущего пользователя)
  if (isCreatorUser === '1' && request.currentUser) {
    query = query.where('creatorId', request.currentUser.id);
  }
  
  const tasks = await query;
  
  // Получаем данные для формы фильтрации
  const statuses = await TaskStatus.query().orderBy('id');
  const users = await User.query().orderBy('id');
  const labels = await Label.query().orderBy('id');
  
  return reply.view('tasks/index.pug', {
    tasks,
    statuses,
    users,
    labels,
    filters: {
      status: status || '',
      executor: executor || '',
      label: label || '',
      isCreatorUser: isCreatorUser || '',
    },
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
  const labels = await Label.query().orderBy('id');
  
  return reply.view('tasks/new.pug', {
    task: {},
    statuses,
    users,
    labels,
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
    const labelIds = Array.isArray(data.labelIds) ? data.labelIds.map(id => Number(id)) : 
                     (data.labelIds ? [Number(data.labelIds)] : []);
    
    const task = await Task.query().insert({
      name: data.name,
      description: data.description || null,
      statusId: Number(data.statusId),
      creatorId: request.currentUser.id,
      executorId: data.executorId ? Number(data.executorId) : null,
    });
    
    if (labelIds.length > 0) {
      await task.$relatedQuery('labels').relate(labelIds);
    }
    
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
    .withGraphFetched('[status, creator, executor, labels]');
  
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
    .withGraphFetched('[status, creator, labels]');
  
  if (!task) {
    request.flash('error', 'Task not found');
    return reply.redirect('/tasks');
  }
  
  const statuses = await TaskStatus.query().orderBy('id');
  const users = await User.query().orderBy('id');
  const labels = await Label.query().orderBy('id');
  
  return reply.view('tasks/edit.pug', {
    task,
    statuses,
    users,
    labels,
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
    
    // Обновляем метки
    const labelIds = Array.isArray(data.labelIds) ? data.labelIds.map(lid => Number(lid)) : 
                     (data.labelIds ? [Number(data.labelIds)] : []);
    await task.$relatedQuery('labels').unrelate();
    if (labelIds.length > 0) {
      await task.$relatedQuery('labels').relate(labelIds);
    }
    
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
