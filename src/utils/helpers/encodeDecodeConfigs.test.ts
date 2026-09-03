import { decodeComponentConfigs, encodeComponentConfigs } from './encodeDecodeConfigs';

describe('encodeComponentConfigs / decodeComponentConfigs', () => {
  it('encodes an object to a base64 string', () => {
    const configs = { foo: 'bar' };
    const encoded = encodeComponentConfigs(configs);

    expect(encoded).toBe(btoa(JSON.stringify(configs)));
  });

  it('round-trips a configuration object', () => {
    const configs = { component: 'marquee', instances: ['one', 'two'], nested: { enabled: true, count: 3 } };

    const encoded = encodeComponentConfigs(configs);
    const decoded = decodeComponentConfigs<typeof configs>(encoded);

    expect(decoded).toEqual(configs);
  });

  it('throws on invalid base64 input', () => {
    expect(() => decodeComponentConfigs('not-valid-base64!!')).toThrow();
  });
});
