const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({});

const proxyRoutes = {
  '/hls': 'http://localhost:8082',
  '/upload': 'http://localhost:8081',
  '/search': 'http://localhost:8082'
};

// proxy.on('proxyReq', (proxyReq, req, res, options) => {
//     proxyReq.setHeader('uploadedBy', req.headers['uploadedBy']);
// })

function proxyMiddleware(req, res, next){
    let target = null;
    for (const path in proxyRoutes) {
        if (req.url.startsWith(path)) {
            target = proxyRoutes[path];
            break;
        }
    }

    if (target) {
        console.log(`Proxying request to: ${target}${req.url}`);
        proxy.web(req, res, { target: target });
    } else {
        next();
    }
}

proxy.on('error', (err, req, res) => {
    console.error('Proxy error:', err);
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    });
    res.end('Something went wrong with the proxy.');
});

module.exports = proxyMiddleware;