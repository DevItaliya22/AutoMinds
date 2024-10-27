import { NextResponse } from 'next/server';
import { watchUser } from '@/app/api/google';

export async function POST(request: Request) {
  const result = await watchUser();

  return NextResponse.json(result);
}
// to run this on prouction i hve to copy IAM and thisng on the AUTOMINDS server to zap-googlw-test IAM server , and make sure to add the service account to the project => gmail-api-push@system.gserviceaccount.com to the project with PUB/SUB PUBLISHER permission

// Response: {
//     config: {
//       url: 'https://gmail.googleapis.com/gmail/v1/users/me/watch',
//       method: 'POST',
//       apiVersion: '',
//       userAgentDirectives: [ [Object] ],
//       paramsSerializer: [Function (anonymous)],
//       data: {
//         topicName: 'projects/zap-436910/topics/gmail-notifications',
//         labelIds: [Array]
//       },
//       headers: {
//         'x-goog-api-client': 'gdcl/7.2.0 gl-node/20.11.1',
//         'Accept-Encoding': 'gzip',
//         'User-Agent': 'google-api-nodejs-client/7.2.0 (gzip)',
//         Authorization: 'Bearer ya29.a0AcM612yvJ4e_ODN_5Y8iQ0XVpSrhODzAguTorPSm1BhxWZT7_K5VZ5pnqkkq8cTRjxhuql49Uv8KOEV63m4JvNNwjrv6xi7byuiFtZMDSSdW7INyTvBglxAC62uTp7g8r4htSp7G3CcpdfKZZxfzK5DhWZCo1NSsEv-_EgsJaCgYKAVcSARISFQHGX2Mi9sKJZnTp6e7lcOybUq2r1g0175',
//         'Content-Type': 'application/json'
//       },
//       params: {},
//       validateStatus: [Function (anonymous)],
//       retry: true,
//       body: '{"topicName":"projects/zap-436910/topics/gmail-notifications","labelIds":["INBOX"]}',
//       responseType: 'unknown',
//       errorRedactor: [Function: defaultErrorRedactor]
//     },
//     data: { historyId: '387493', expiration: '1730229789328' },
//     headers: {
//       'alt-svc': 'h3=":443"; ma=2592000,h3-29=":443"; ma=2592000',
//       'cache-control': 'private',
//       'content-encoding': 'gzip',
//       'content-type': 'application/json; charset=UTF-8',
//       date: 'Tue, 22 Oct 2024 19:23:09 GMT',
//       server: 'ESF',
//       'transfer-encoding': 'chunked',
//       vary: 'Origin, X-Origin, Referer',
//       'x-content-type-options': 'nosniff',
//       'x-frame-options': 'SAMEORIGIN',
//       'x-xss-protection': '0'
//     },
//     status: 200,
//     statusText: 'OK',
//     request: {
//       responseURL: 'https://gmail.googleapis.com/gmail/v1/users/me/watch'
//     }
//   }
