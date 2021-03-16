export enum WebsocketEventType {
    USER_CONNECTED = 'USER_CONNECTED',
    USER_DISCONNECTED = 'USER_DISCONNECTED',
    USER_TAKE_ORDER = 'USER_TAKE_ORDER',
}

export interface WebsocketEvent<T> {
    type: WebsocketEventType;
    data: T;
}
