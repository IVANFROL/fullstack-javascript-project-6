import Label from '../models/Label.js';

export const index = async (request, reply) => {
  const labels = await Label.query().orderBy('id');
  return reply.view('labels/index.pug', {
    labels,
    t: request.t,
    currentUser: request.currentUser,
  });
};

export const newLabel = async (request, reply) => {
  if (!request.currentUser) {
    request.flash('error', 'You must be logged in');
    return reply.redirect('/session/new');
  }
  
  return reply.view('labels/new.pug', {
    label: {},
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
    await Label.query().insert({
      name: data.name,
    });
    request.flash('success', 'Label has been created');
    return reply.redirect('/labels');
  } catch (error) {
    request.flash('error', error.message || 'Failed to create label');
    return reply.redirect('/labels/new');
  }
};

export const edit = async (request, reply) => {
  if (!request.currentUser) {
    request.flash('error', 'You must be logged in');
    return reply.redirect('/session/new');
  }
  
  const { id } = request.params;
  const label = await Label.query().findById(id);
  
  if (!label) {
    request.flash('error', 'Label not found');
    return reply.redirect('/labels');
  }
  
  return reply.view('labels/edit.pug', {
    label,
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
    
    const label = await Label.query().findById(id);
    if (!label) {
      request.flash('error', 'Label not found');
      return reply.redirect('/labels');
    }
    
    await Label.query().findById(id).patch({
      name: data.name,
    });
    request.flash('success', 'Label has been updated');
    return reply.redirect('/labels');
  } catch (error) {
    request.flash('error', error.message || 'Failed to update label');
    return reply.redirect(`/labels/${request.params.id}/edit`);
  }
};

export const destroy = async (request, reply) => {
  if (!request.currentUser) {
    request.flash('error', 'You must be logged in');
    return reply.redirect('/session/new');
  }
  
  try {
    const { id } = request.params;
    const label = await Label.query().findById(id);
    
    if (!label) {
      request.flash('error', 'Label not found');
      return reply.redirect('/labels');
    }
    
    const { knex } = await import('../lib/db.js');
    const tasksCount = await knex('task_labels')
      .where('labelId', id)
      .count('* as count')
      .first();
    
    if (tasksCount && Number(tasksCount.count) > 0) {
      request.flash('error', 'Cannot delete label with associated tasks');
      return reply.redirect('/labels');
    }
    
    await Label.query().deleteById(id);
    request.flash('success', 'Label has been deleted');
    return reply.redirect('/labels');
  } catch (error) {
    request.flash('error', error.message || 'Failed to delete label');
    return reply.redirect('/labels');
  }
};
