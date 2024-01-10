import { prefixerStr } from "../src"

describe('autoprefixer - function prefixerStr - baseUrl: /test - origin: http://www.test.com', () => {
  // no prarms
  it('prefixerStr() -> /test', () => {
    const rand = prefixerStr();
    expect(rand).toBe('/test');
  });
  // normal
  it("prefixerStr('/api/fetchNum') -> /test/api/fetchNum", () => {
    const rand = prefixerStr('/api/fetchNum');
    expect(rand).toBe('/test/api/fetchNum');
  });
  // undefined
  it('prefixerStr(undefined) -> /test', () => {
    const rand = prefixerStr(undefined);
    expect(rand).toBe('/test');
  });
  // {}
  it('prefixerStr({}) -> /test', () => {
    const rand = prefixerStr({});
    expect(rand).toBe('/test');
  });
  // completely url startwih http
  it("prefixerStr('http://www.fastmock.com/fetchnum') -> http://www.fastmock.com/fetchnum", () => {
    const rand = prefixerStr('http://www.fastmock.com/fetchnum');
    expect(rand).toBe('http://www.fastmock.com/fetchnum');
  });
  // ip address
  it("prefixerStr('http://192.168.0.1:8080/fetchnum') -> http://192.168.0.1:8080/fetchnum", () => {
    const rand = prefixerStr('http://192.168.0.1:8080/fetchnum');
    expect(rand).toBe('http://192.168.0.1:8080/fetchnum');
  });
  // other protocol
  it("prefixerStr('ws://192.168.0.1:8080/fetchnum') -> ws://192.168.0.1:8080/fetchnum", () => {
    const rand = prefixerStr('ws://192.168.0.1:8080/fetchnum');
    expect(rand).toBe('ws://192.168.0.1:8080/fetchnum');
  });
  // same origin
  it("prefixerStr('http://www.test.com/fetchnum') -> http://www.test.com/test/fetchnum", () => {
    const rand = prefixerStr('http://www.test.com/fetchnum');
    expect(rand).toBe('http://www.test.com/test/fetchnum');
  });
});

