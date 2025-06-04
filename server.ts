import express from 'express';
import { renderPage } from 'vike/server';
import { fileURLToPath } from 'url';
import path from 'path';

console.log('Server script starting...');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname);
const isProduction = process.env.NODE_ENV === 'production';
console.log(`Root directory: ${root}`);
console.log(`Is production: ${isProduction}`);

async function startServer() {
  console.log('startServer function entered...');
  const app = express();
  console.log('Express app created.');

  if (isProduction) {
    console.log('Setting up static middleware for production...');
    app.use(express.static(`${root}/dist/client`));
    console.log('Static middleware added.');
  } else {
    console.log('Vike will handle Vite dev middleware.');
  }

  app.get('*', async (req, res, next) => {
    console.log(`Handling request for: ${req.originalUrl}`);
    const pageContextInit = { urlOriginal: req.originalUrl };
    try {
      const pageContext = await renderPage(pageContextInit);
      console.log(`Page context rendered for: ${req.originalUrl}`);
      const { httpResponse } = pageContext;
      if (!httpResponse) {
        console.log(`No HTTP response from page context for: ${req.originalUrl}`);
        return next();
      }
      const { body, statusCode, headers } = httpResponse;
      console.log(`Sending response for: ${req.originalUrl} with status ${statusCode}`);
      headers.forEach(([name, value]) => res.setHeader(name, value));
      res.status(statusCode).send(body);
    } catch (error) {
      console.error(`Error rendering page for ${req.originalUrl}:`, error);
      next(error);
    }
  });

  const port = process.env.PORT || 8085; // Changed to 8085
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

console.log('Calling startServer()...');
startServer().catch(e => {
  console.error('Unhandled error during server startup:', e);
});
console.log('Server script finished synchronous execution.');