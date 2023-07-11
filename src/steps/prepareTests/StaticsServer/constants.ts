export const logs = {
  serveStatics: (statics: string, port: number) =>
    `Serving statics from ${statics} on port ${port}`,
  closeStatics: (port: number) => `Closing statics server on port ${port}`,
};
