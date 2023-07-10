
  /** @type {import('../../types').UITeskitConfigFile} */
  export default {
    name: "component110-ts",
    url: "http://localhost:3000/component110-ts.html",
    skip: false,
    tests: [
      {
        type:'axe',
        description: 'Accessibility test 1',
        selector: '#app',
        config:{
          disableRules: ['color-contrast'],
        },
      },
      {
        type:'visual',
        description: 'Visual test 1',
        config:{
          threshold: 0.1,
          screenHeight: 1024,
          screenWidth: 1080,
          x: 0,
          y: 0,
        },
      }
    ]
  };
