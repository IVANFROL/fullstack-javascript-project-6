import TaskStatus from '../models/TaskStatus.js';
import { requireAuth } from '../middleware/auth.js';

export const index = async (request, reply) => {
  const statuses = await TaskStatus.query().orderBy('id');
  return reply.view('statuses/index.pug', {
    statuses,
    t: request.t,
    currentUser: request.currentUser,
  });
};

export const newStatus = async (request, reply) => {
  if (!request.currentUser) {
    request.flash('error', 'You must be logged in');
    return reply.redirect('/session/new');
  }
  
  return reply.view('statuses/new.pug', {
    status: {},
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
    await TaskStatus.query().insert({
      name: data.name,
    });
    request.flash('success', 'Status has been created');
    return reply.redirect('/statuses');
  } catch (error) {
    request.flash('error', error.message || 'Failed to create status');
    return reply.redirect('/statuses/new');
  }
};

export const edit = async (request, reply) => {
  if (!request.currentUser) {
    request.flash('error', 'You must be logged in');
    return reply.redirect('/session/new');
  }
  
  const { id } = request.params;
  const status = await TaskStatus.query().findById(id);
  
  if (!status) {
    request.flash('error', 'Status not found');
    return reply.redirect('/statuses');
  }
  
  return reply.view('statuses/edit.pug', {
    status,
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
    
    const status = await TaskStatus.query().findById(id);
    if (!status) {
      request.flash('error', 'Status not found');
      return reply.redirect('/statuses');
    }
    
    await TaskStatus.query().findById(id).patch({
      name: data.name,
    });
    request.flash('success', 'Status has been updated');
    return reply.redirect('/statuses');
  } catch (error) {
    request.flash('error', error.message || 'Failed to update status');
    return reply.redirect(`/statuses/${request.params.id}/edit`);
  }
};

export const destroy = async (request, reply) => {
  if (!request.currentUser) {
    request.flash('error', 'You must be logged in');
    return reply.redirect('/session/new');
  }
  
  try {
    const { id } = request.params;
    const status = await TaskStatus.query().findById(id);
    
    if (!status) {
      request.flash('error', 'Status not found');
      return reply.redirect('/statuses');
    }
    
    await TaskStatus.query().deleteById(id);
    request.flash('success', 'Status has been deleted');
    return reply.redirect('/statuses');
  } catch (error) {
    request.flash('error', error.message || 'Failed to delete status');
    return reply.redirect('/statuses');
  }
};
