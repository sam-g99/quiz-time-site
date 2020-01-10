const Session = require('../../database/models/sessions');

const isAuthorized = async (req) => {
  console.log('checked auth');
  if (req.session.userId) {
    return true;
  }
  const loginCookie = req.cookies.login_secret;
  console.log(req.cookies, 'cookies');
  if (loginCookie) {
    const loginSession = Session.findOne({ where: { cookie: loginCookie } });
    const userId = loginSession.user_id;
    req.session.userId = userId;
    return true;
  }
  console.log('false');
  return false;
};

module.exports = isAuthorized;
