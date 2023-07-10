const mockPage = {
  goto: jest.fn(),
  setViewport: jest.fn(),
  screenshot: jest.fn(() => Buffer.alloc(0)),
};

const mockBrowser = {
  newPage: jest.fn(() => mockPage),
  close: jest.fn(),
};

const puppeteer = {
  launch: jest.fn(() => {
    return mockBrowser;
  }),
};

export default puppeteer;
