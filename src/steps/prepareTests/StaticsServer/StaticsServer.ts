import serveStatic from 'serve-static';
import finalhandler from 'finalhandler';
import http from 'http';
import { logger } from '../../../utils/logger.js';
import { messages } from '../../../constants/messages.js';

export class StaticsServer {
  server: http.Server = null;
  port = 3002;
  statics = null;

  constructor(port = 3002, statics = null) {
    this.port = port;
    this.statics = statics;
  }

  async serve() {
    if (!this.statics) return null;

    if (this.server) {
      return this.server;
    }

    const serve = serveStatic(this.statics, {
      index: ['index.html', 'index.htm'],
    });

    const server = http.createServer(function onRequest(req, res) {
      serve(req, res, finalhandler(req, res));
    });

    server.listen(this.port);

    logger.info(messages.info.serveStatics(this.statics, this.port));

    this.server = server;
  }

  close() {
    if (!this.server) return;

    this.server.close();
    this.server = null;

    logger.info(messages.info.closeStatics(this.port));
  }
}
