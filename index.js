const cspawn = require('child_process').spawn;
const fs = require('fs');
const passwd = () => { return require('parse-passwd')(fs.readFileSync('/etc/passwd', 'utf8')) };
const LocalStrategy = require('passport-local').Strategy;

const Strategy = new LocalStrategy({
  passReqToCallback: true
}, (req, username, password, done) => {
  login = cspawn('su', ['-c true', username]);
  login.on('exit', (code) => {
    if (code === 0) {
      let user = passwd().find(user => {return user.username == username});
      user.password = password;
      req.session.user = user;
      req.user = user;
      done(null, user);
    } else {
      done(new Error('Authentication Failed'), null);
    }
  });
  login.stdin.write(password + '\n')
});

module.exports.Strategy = Strategy
