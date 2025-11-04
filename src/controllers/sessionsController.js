import User from '../models/User.js';

export const newSession = async (request, reply) => {
  return reply.view('sessions/new.pug', {
    t: request.t,
  });
};

export const create = async (request, reply) => {
  try {
    const { data } = request.body;
    const user = await User.query().findOne({ email: data.email });
    
    if (!user || !(await user.verifyPassword(data.password))) {
      request.flash('error', 'Invalid email or password');
      return reply.redirect('/session/new');
    }
    
    request.session.set('userId', user.id);
    request.flash('success', 'Successfully logged in');
    return reply.redirect('/');
  } catch (error) {
    request.flash('error', error.message || 'Failed to login');
    return reply.redirect('/session/new');
  }
};

export const destroy = async (request, reply) => {
  request.session.delete();
  request.flash('success', 'Successfully logged out');
  return reply.redirect('/');
};
