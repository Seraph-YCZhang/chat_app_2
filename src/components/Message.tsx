import { Box } from '@chakra-ui/react';
import { FC, memo, useEffect, useRef, useState } from 'react';
import styles from './Message.module.css';

interface MessageProps {
    data: string;
    isSent: boolean;
}
const Message: FC<MessageProps> = memo(({ data, isSent }) => {
    const audioRef = useRef(null);
    const [duration, setDuration] = useState<number>();
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.onloadedmetadata = () => {
                setDuration(audioRef.current.duration);
            };
        }
    }, [audioRef]);
    return (
        <Box
            border='1px solid #f3f3f3'
            shadow='base'
            p='0.5rem 1rem'
            borderRadius='md'
            mb='1rem'
            bgColor={isSent ? '#fff' : '#f3f3f3'}
            ml={isSent ? 32 : 0}
            mr={isSent ? 0 : 32}
        >
            {typeof data === 'string' ? (
                data
            ) : (
                <>
                    <audio
                        ref={audioRef}
                        src={URL.createObjectURL(data)}
                        controls
                        controlsList='nodownload'
                    />
                </>
            )}
        </Box>
    );
});

export default Message;
