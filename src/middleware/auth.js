export const requireAuth = async (request, reply) => {
  const userId = request.session.get('userId');
  if (!userId) {
    request.flash('error', 'You must be logged in');
    return reply.redirect('/session/new');
  }
};

export const setUser = async (request, reply) => {
  const userId = request.session.get('userId');
  if (userId) {
    const User = (await import('../models/User.js')).default;
    request.currentUser = await User.query().findById(userId);
  }
};
