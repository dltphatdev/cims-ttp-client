module.exports = {
  apps: [
    {
      name: 'cims-ttp-client',
      script: 'npm',
      args: 'run preview -- --host --port 3000',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
