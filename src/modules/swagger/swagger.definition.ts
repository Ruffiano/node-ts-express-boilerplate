import config from '../../config/config';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'web.storage.infura',
    version: '0.0.1',
    description: ''
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
      description: 'Development Server',
    },
  ],
};

export default swaggerDefinition;
