export default {
  PNG: class {
    width: number;
    height: number;
    data: Buffer;
    constructor({ width, height }: { width: number; height: number }) {
      this.width = width;
      this.height = height;
      this.data = Buffer.alloc(width * height * 4);
    }
    static sync = {
      read: (buffer: Buffer) => {
        const png = new this({ width: 1, height: 1 });
        png.data = buffer;
        return png;
      },
      write: (png: any) => {
        return png.data;
      },
    };
  },
};
