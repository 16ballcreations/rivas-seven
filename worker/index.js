// Redirecciones antes de servir los archivos estáticos:
// - http:// → https://
// - www.rivasseven.com → rivasseven.com (una sola dirección oficial)
// Lo demás se entrega tal cual desde los assets.
const HOST = 'rivasseven.com';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const isSiteHost = url.hostname === HOST || url.hostname === `www.${HOST}`;

    if (isSiteHost && (url.protocol === 'http:' || url.hostname !== HOST)) {
      url.protocol = 'https:';
      url.hostname = HOST;
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
