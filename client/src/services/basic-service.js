import http from './http-service';

const updateHandlers = [];

export default class BasicService {
  constructor(options) {
    if (options && options.onUpdate) {
      updateHandlers.push({ name: this.constructor.name, callback: options.onUpdate });
    }
  }

  onUpdate = callback => {
    updateHandlers.push({ name: this.constructor.name, callback });
  }

  update = data => {
    updateHandlers.forEach(handler => {
      if (handler.name === this.constructor.name) {
        handler.callback(data);
      }
    });
  }

  request = async (method, uri, body) => {
    const result = await http(uri, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const parsed = await result.json();

    if (method === 'POST' || method === 'PUT') {
      this.update(parsed);
    }

    return parsed;
  }
}
