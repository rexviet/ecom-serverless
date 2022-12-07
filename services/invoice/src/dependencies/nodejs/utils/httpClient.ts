import HttpHeaders from '../common/httpHeader';
import p from 'phin';
import queryString from 'querystring';

export interface HttpClient {
  get<T>(options: HttpClientOptions): Promise<HttpClientResponse<T>>;
  del<T>(options: HttpClientOptions): Promise<HttpClientResponse<T>>;
  put<T>(options: HttpClientPostOptions): Promise<HttpClientResponse<T>>;
  post<T>(options: HttpClientPostOptions): Promise<HttpClientResponse<T>>;
  patch<T>(options: HttpClientPostOptions): Promise<HttpClientResponse<T>>;
}

export class PhinHttpClient implements HttpClient {
  private readonly originalHeaders: object;

  constructor(private readonly endpoint: string, apiKey: string) {
    this.originalHeaders = {
      [HttpHeaders.X_API_KEY]: apiKey,
      [HttpHeaders.CONTENT_TYPE]: 'application/json',
    };
  }

  public async get<T>(options: HttpClientOptions): Promise<HttpClientResponse<T>> {
    const url = this.buildFullUrlWithParams(this.endpoint, options.path, options.params);

    const res = await p({
      url,
      method: 'GET',
      parse: 'json',
      headers: this.joinHeaders(this.originalHeaders, options.headers),
    });

    const { statusCode } = res;
    const { headers } = res;
    const body = res.body as T;

    return {
      statusCode,
      headers,
      body,
    };
  }

  public async del<T>(options: HttpClientOptions): Promise<HttpClientResponse<T>> {
    const url = this.buildFullUrlWithParams(this.endpoint, options.path, options.params);

    const res = await p({
      url,
      method: 'DELETE',
      parse: 'json',
      headers: this.joinHeaders(this.originalHeaders, options.headers),
    });

    const { statusCode } = res;
    const { headers } = res;
    const body = res.body as T;

    return {
      statusCode,
      headers,
      body,
    };
  }

  public async put<T>(options: HttpClientPostOptions): Promise<HttpClientResponse<T>> {
    const url = this.buildFullUrlWithParams(this.endpoint, options.path, options.params);

    const res = await p({
      url,
      method: 'PUT',
      parse: 'json',
      headers: this.joinHeaders(this.originalHeaders, options.headers),
      data: options.body,
    });

    const { statusCode } = res;
    const { headers } = res;
    const body = res.body as T;

    return {
      statusCode,
      headers,
      body,
    };
  }

  public async post<T>(options: HttpClientPostOptions): Promise<HttpClientResponse<T>> {
    const url = this.buildFullUrlWithParams(this.endpoint, options.path, options.params);

    const res = await p({
      url,
      method: 'POST',
      parse: 'json',
      headers: this.joinHeaders(this.originalHeaders, options.headers),
      data: options.body,
    });

    const { statusCode } = res;
    const { headers } = res;
    const body = res.body as T;

    return {
      statusCode,
      headers,
      body,
    };
  }

  public async patch<T>(options: HttpClientPostOptions): Promise<HttpClientResponse<T>> {
    const url = this.buildFullUrlWithParams(this.endpoint, options.path, options.params);

    const res = await p({
      url,
      method: 'PATCH',
      parse: 'json',
      headers: this.joinHeaders(this.originalHeaders, options.headers),
      data: options.body,
    });

    const { statusCode } = res;
    const { headers } = res;
    const body = res.body as T;

    return {
      statusCode,
      headers,
      body,
    };
  }

  private joinHeaders(originalHeaders: object, additionalHeaders?: object): object {
    let finalHeaders = originalHeaders;

    if (additionalHeaders) {
      finalHeaders = { ...originalHeaders, ...additionalHeaders };
    }

    return finalHeaders;
  }

  private buildFullUrlWithParams(endpoint: string, path: string, params?: object): string {
    let pathWithParams = path;
    if (params) {
      pathWithParams = `${path}?${queryString.stringify(params as any)}`;
    }

    return `${endpoint}${pathWithParams}`;
  }
}

export interface HttpClientOptions {
  readonly path: string;
  readonly headers?: object;
  readonly params?: object;
}

export interface HttpClientPostOptions extends HttpClientOptions {
  readonly body?: object;
}

export interface HttpClientResponse<T> {
  readonly statusCode: number;
  readonly body: T;
  readonly headers: object;
}
