import User from '../models/User.js';

export const index = async (request, reply) => {
  const users = await User.query();
  return reply.view('users/index.pug', {
    users,
    t: request.t,
    currentUser: request.currentUser,
  });
};

export const newUser = async (request, reply) => {
  return reply.view('users/new.pug', {
    user: {},
    t: request.t,
  });
};

export const create = async (request, reply) => {
  try {
    const { data } = request.body;
    const user = await User.query().insert({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    });
    request.flash('success', 'User successfully created');
    request.session.set('userId', user.id);
    return reply.redirect('/');
  } catch (error) {
    request.flash('error', error.message || 'Failed to create user');
    return reply.redirect('/users/new');
  }
};

export const edit = async (request, reply) => {
  const { id } = request.params;
  const currentUser = request.currentUser;
  
  if (!currentUser || currentUser.id !== Number(id)) {
    request.flash('error', 'You can only edit your own profile');
    return reply.redirect('/users');
  }
  
  const user = await User.query().findById(id);
  if (!user) {
    request.flash('error', 'User not found');
    return reply.redirect('/users');
  }
  
  return reply.view('users/edit.pug', {
    user,
    t: request.t,
  });
};

export const update = async (request, reply) => {
  const { id } = request.params;
  const currentUser = request.currentUser;
  
  if (!currentUser || currentUser.id !== Number(id)) {
    request.flash('error', 'You can only update your own profile');
    return reply.redirect('/users');
  }
  
  try {
    const { data } = request.body;
    await User.query().findById(id).patch({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      ...(data.password && { password: data.password }),
    });
    request.flash('success', 'User successfully updated');
    return reply.redirect('/users');
  } catch (error) {
    request.flash('error', error.message || 'Failed to update user');
    return reply.redirect(`/users/${id}/edit`);
  }
};

export const destroy = async (request, reply) => {
  const { id } = request.params;
  const currentUser = request.currentUser;
  
  if (!currentUser || currentUser.id !== Number(id)) {
    request.flash('error', 'You can only delete your own profile');
    return reply.redirect('/users');
  }
  
  try {
    const Task = (await import('../models/Task.js')).default;
    const tasksAsCreator = await Task.query().where('creatorId', id);
    const tasksAsExecutor = await Task.query().where('executorId', id);
    
    if (tasksAsCreator.length > 0 || tasksAsExecutor.length > 0) {
      request.flash('error', 'Cannot delete user with associated tasks');
      return reply.redirect('/users');
    }
    
    await User.query().deleteById(id);
    request.session.delete();
    request.flash('success', 'User successfully deleted');
    return reply.redirect('/');
  } catch (error) {
    request.flash('error', error.message || 'Failed to delete user');
    return reply.redirect('/users');
  }
};
