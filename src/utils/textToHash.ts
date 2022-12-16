import { createHash } from 'crypto';

export default (text: string): string => {
  text = createHash('sha1').update(text).digest('hex');
  return createHash('md5').update(text).digest('hex');
};
