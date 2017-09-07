import * as rp from 'request-promise'

export default function parseRequest (baseUrl: string, appId: string, masterKey: string, method: string, endpoint: string, body?: any): rp.RequestPromise {
  const request = rp({
    method: method,
    uri: baseUrl + '/' + endpoint,
    body: body,
    headers: {
      'X-Parse-Application-Id': appId,
      'X-Parse-Master-Key': masterKey,
      'Content-Type': 'application/json'
    },
    json: true
  })
  return request
}
