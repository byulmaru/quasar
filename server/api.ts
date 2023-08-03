type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS' | 'CONNECT' | 'TRACE';


export default function api<ReturnDataType = any>(server: string, method: HTTPMethod, path: string, data: any = {}, options: RequestInit = {}) {
  const url = new URL(`https://${server}/${path}`);
  if(method === 'GET') {
    url.search = new URLSearchParams(data).toString();
  }
  else {
    options.body = JSON.stringify(data);
    if(!options.headers) options.headers = {};
    options.headers['Content-Type'] = 'application/json';
  }
  return fetch(url, {
    method,
    ...options
  })
  .then(async(res) => {
    if(!res.ok) {
      console.error(`${res.status} ${res.statusText}`);
      console.error(await res.json());
      throw res;
    }
    return res.json() as Promise<ReturnDataType>
  });
}