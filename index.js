/* jshint node: true */
'use strict';
var path             = require('path');
var DeployPluginBase = require('ember-cli-deploy-plugin');
var Ssh              = require('./lib/ssh');

module.exports = {
  name: 'ember-cli-deploy-multi-ssh-index',

  createDeployPlugin: function(options) {
    var DeployPlugin = DeployPluginBase.extend({
      name: options.name,

      defaultConfig: {
        allowOverwrite: false,
        filePattern: 'index.html',
        port: 22,
        privateKeyFile: null,
        agent: null,
        passphrase: null,
        distDir: function(context) {
          return context.distDir;
        },
        revisionKey: function(context) {
          var revisionKey = context.revisionData && context.revisionData.revisionKey;
          return context.commandOptions.revision || revisionKey;
        }
      },

      requiredConfig: ['username', 'hosts', 'port', 'remoteDir'],

      upload: function(context) {
        var allowOverwrite = this.readConfig('allowOverwrite');
        var filePattern    = this.readConfig('filePattern');
        var distDir        = this.readConfig('distDir');
        var revisionKey    = this.readConfig('revisionKey');
        var username       = this.readConfig('username');
        var hosts          = this.readConfig('hosts');
        var port           = this.readConfig('port');
        var remoteDir      = this.readConfig('remoteDir');
        var privateKeyFile = this.readConfig('privateKeyFile');
        var passphrase     = this.readConfig('passphrase');
        var agent          = this.readConfig('agent');
        var filePath       = path.join(distDir, filePattern);

        var options = {
          allowOverwrite: allowOverwrite,
          filePattern: filePattern,
          filePath: filePath,
          revisionKey: revisionKey,
          username: username,
          hosts: hosts,
          port: port,
          remoteDir: remoteDir,
          passphrase: passphrase,
          agent: agent,
          privateKeyFile: privateKeyFile
        };

        var ssh = new Ssh({ plugin: this });
        return ssh.upload(options);
      },

      activate: function(context) {
        var filePattern    = this.readConfig('filePattern');
        var revisionKey    = this.readConfig('revisionKey');
        var username       = this.readConfig('username');
        var hosts          = this.readConfig('hosts');
        var port           = this.readConfig('port');
        var remoteDir      = this.readConfig('remoteDir');
        var passphrase     = this.readConfig('passphrase');
        var agent          = this.readConfig('agent');
        var privateKeyFile = this.readConfig('privateKeyFile');

        var options = {
          filePattern: filePattern,
          revisionKey: revisionKey,
          username: username,
          hosts: hosts,
          port: port,
          remoteDir: remoteDir,
          passphrase: passphrase,
          agent: agent,
          privateKeyFile: privateKeyFile
        };

        var ssh = new Ssh({ plugin: this });
        return ssh.activate(options);
      },

      fetchRevisions: function(context) {
        var filePattern    = this.readConfig('filePattern');
        var username       = this.readConfig('username');
        var hosts          = this.readConfig('hosts');
        var port           = this.readConfig('port');
        var remoteDir      = this.readConfig('remoteDir');
        var passphrase     = this.readConfig('passphrase');
        var agent          = this.readConfig('agent');
        var privateKeyFile = this.readConfig('privateKeyFile');

        var options = {
          filePattern: filePattern,
          username: username,
          host: hosts[0],
          port: port,
          remoteDir: remoteDir,
          passphrase: passphrase,
          agent: agent,
          privateKeyFile: privateKeyFile
        };

        var ssh = new Ssh({ plugin: this });
        return ssh.fetchRevisions(options).then(function(revisions) {
          if (revisions && revisions.length) {
            context.revisions = revisions;
          }
        });
      }
    });

    return new DeployPlugin();
  }
};
