import http from './httpService';
import BasicService from './basicService';

export default class StreamerService extends BasicService {
  createPlayer = async({ name, photo, position }) => {
    const request = await http(`/api/streamer/players`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        photo,
        position
      }),
    });
    const requestResult = await request.json();
    return requestResult;
  }
}
