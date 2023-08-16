module.exports = {
  apps : [{
    script: 'npm start'
  }], 
  deploy : {
    production : {
      user : 'ubuntu',
      host : '186.127.105.223',
      ref  : 'origin/main',
      repo : 'git@github.com:Rixonic/deployHSJD.git',
      path : '/home/ubuntu',
      'pre-deploy-local': '',
      'post-deploy' : 'source ~/.nvm/nvm.sh && npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      'ssh_options': 'ForwardAgent=yes'
    }
  }
};
