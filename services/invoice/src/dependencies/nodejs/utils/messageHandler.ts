import lambdaWarmer from 'lambda-warmer';
// import * as cjson from 'compressed-json';

export const messageHandler = (handler: (request: any) => any) => {
  return async (event: any) => {
    try {
      if (await lambdaWarmer(event)) return 'warmed';
      // console.log('messageHandler event:', event);
      // event.Records = event.Records.map((record: any) => {
      //   record.body = JSON.stringify(cjson.decompress.fromString(record.body));
      //   return record;
      // });
      // console.log('event after:', event);
      return await handler(event);
    } catch (error) {
      console.error('error:', error);
      throw error;
    }
  };
};
