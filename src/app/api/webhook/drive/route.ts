import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const headers = req.headers;

    const resourceState = headers.get('x-goog-resource-state');
    const resourceId = headers.get('x-goog-resource-id');
    const channelId = headers.get('x-goog-channel-id');
    const resourceUri = headers.get('x-goog-resource-uri');

    console.log('Resource State:', resourceState);
    console.log('Resource ID:', resourceId);
    console.log('Channel ID:', channelId);
    console.log('Resource URI:', resourceUri);

    return NextResponse.json({ message: 'Webhook received successfully' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 400 },
    );
  }
}
// This is a trigger we get when we upload a file to the folder we are watching
// Resource State: update
// Resource ID: mf6Sf-wZ-0cYVI_uVcTzz-6wY0A
// Channel ID: 19wGu8wELggpoEccVpfDuK8Zea5yV8Cro
// Resource URI: https://www.googleapis.com/drive/v3/files/19wGu8wELggpoEccVpfDuK8Zea5yV8Cro?alt=json&null

// This is a trigger we get when we delete a file from the folder we are watching
// Resource State: trash
// Resource ID: mf6Sf-wZ-0cYVI_uVcTzz-6wY0A
// Channel ID: 19wGu8wELggpoEccVpfDuK8Zea5yV8Cro
// Resource URI: https://www.googleapis.com/drive/v3/files/19wGu8wELggpoEccVpfDuK8Zea5yV8Cro?alt=json&null

// This is a trigger when we wtach a file
// Resource State: sync
// Resource ID: YXxk2FRa4_YbAXZAg0zX6j7GP2o
// Channel ID: 1s-ra2nYK73Cj8doTlu2QWObNToiX26DJ4s68wxEMaj4
// Resource URI: https://www.googleapis.com/drive/v3/files/1s-ra2nYK73Cj8doTlu2QWObNToiX26DJ4s68wxEMaj4?alt=json&null

//  when we wdit a filen
// Resource State: update
// Resource ID: YXxk2FRa4_YbAXZAg0zX6j7GP2o
// Channel ID: 1s-ra2nYK73Cj8doTlu2QWObNToiX26DJ4s68wxEMaj4
// Resource URI: https://www.googleapis.com/drive/v3/files/1s-ra2nYK73Cj8doTlu2QWObNToiX26DJ4s68wxEMaj4?alt=json&null

// and wwhen w delete that file
// Resource State: trash
// Resource ID: mf6Sf-wZ-0cYVI_uVcTzz-6wY0A
// Channel ID: 19wGu8wELggpoEccVpfDuK8Zea5yV8Cro
// Resource URI: https://www.googleapis.com/drive/v3/files/19wGu8wELggpoEccVpfDuK8Zea5yV8Cro?alt=json&null
