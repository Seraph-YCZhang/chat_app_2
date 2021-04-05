import { useEffect, useState } from 'react';

interface SocketConfig {
    socketUrl: string;
    retry?: number;
    retryInterval?: number;
}
function useSocket({
    socketUrl,
    retry: defaultRetry = 3,
    retryInterval = 1500
}: SocketConfig) {
    const [data, setData] = useState<any>({});
    const [send, setSend] = useState<any>(() => () => undefined);

    const [retry, setRetry] = useState<number>(defaultRetry);
    const [readyState, setReadyState] = useState<boolean>(false);
    useEffect(() => {
        const ws = new WebSocket(socketUrl);
        ws.onopen = () => {
            console.log('connected!');
            setReadyState(true);
            setSend(() => (data: any) => {
                try {
                    if (data instanceof Blob) {
                        ws.send(data);
                        return true;
                    }
                    const d = JSON.stringify(data);
                    ws.send(d);
                    return true;
                } catch (e) {
                    return false;
                }
            });

            ws.onmessage = (ev: MessageEvent) => {
                const data = ev.data;
                console.log(ev);
                // if(typeof data === 'string') {
                const formatted = formatMessage(data);
                setData(formatted);
                // } else {}
            };
        };
        ws.onclose = () => {
            setReadyState(false);
            if (retry > 0) {
                setTimeout(() => {
                    setRetry(prev => prev - 1);
                }, retryInterval);
            }
        };
        return () => {
            ws.close();
        };
    }, [retry]);
    return { send, data, readyState };
}

function formatMessage(data) {
    try {
        const parsed = JSON.parse(data);
        return parsed;
    } catch (e) {
        return data;
    }
}

export default useSocket;
