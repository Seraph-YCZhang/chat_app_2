import { Button } from '@chakra-ui/button';
import { FormLabel } from '@chakra-ui/form-control';
import { Box, Flex, Heading, Stack } from '@chakra-ui/layout';
import { Tag, TagLabel } from '@chakra-ui/tag';
import { Textarea } from '@chakra-ui/textarea';
import { FC, useEffect, useRef, useState } from 'react';
import Layout from '../components/Layout';
import Message from '../components/Message';
import useSocket from '../hooks/useSocket';
import { MESSAGE, ONLINE_NUMBER } from '../util/constans';
import { RiWechatLine } from 'react-icons/ri';
import { AiFillAudio } from 'react-icons/ai';
import Icon from '@chakra-ui/icon';
interface MessageObject {
    message: string | Blob;
    isSentMessage: boolean;
}
const Chat: FC = () => {
    const [messages, setMessages] = useState<Array<MessageObject>>([
        { message: 'Welcome to this chat room!', isSentMessage: false }
    ]);
    const [audioRecording, setAudioRecording] = useState<boolean>(false);
    const [onlineNum, setOnlineNum] = useState(0);
    const ws = useSocket({ socketUrl: 'ws://192.168.1.153:8000' });
    const txtRef = useRef(null);
    const recorder = useRef(null);
    useEffect(() => {
        if (ws.data) {
            if (ws.data.type === MESSAGE) {
                const { message } = ws.data;
                if (!message) {
                    return;
                }
                setMessages(msgs => [
                    ...msgs,
                    { message, isSentMessage: false }
                ]);
            } else if (ws.data.type === ONLINE_NUMBER) {
                const { data } = ws.data;
                if (!data) {
                    return;
                }
                setOnlineNum(data);
            } else {
                if (ws.data instanceof Blob)
                    setMessages(msgs => [
                        ...msgs,
                        { message: ws.data, isSentMessage: false }
                    ]);
            }
        }
    }, [ws.data]);
    // useEffect(()=>{

    // }, [])
    const sendData = () => {
        if (!txtRef.current) {
            return;
        }
        const message = txtRef.current.value || '';
        if (message) {
            setMessages(msgs => [...msgs, { message, isSentMessage: true }]);
        }
        ws.send({ message, type: MESSAGE });
        txtRef.current.value = '';
    };
    const handleAudioRecord = async () => {
        const constrains = { audio: true };
        let chunks = [];
        navigator.mediaDevices
            .getUserMedia(constrains)
            .then(function (mediaStream) {
                if (audioRecording) {
                    if (
                        !recorder.current ||
                        recorder.current.state === 'inactive'
                    ) {
                        return;
                    }
                    recorder.current.stop();
                    setAudioRecording(false);
                } else {
                    const mediaRecorder = new MediaRecorder(mediaStream);
                    recorder.current = mediaRecorder;
                    mediaRecorder.ondataavailable = function (e) {
                        chunks.push(e.data);
                    };
                    mediaRecorder.onstop = function (e) {
                        var blob = new Blob(chunks, {
                            type: 'audio/ogg; codecs=opus'
                        });
                        setAudioRecording(false);
                        ws.send(blob);
                    };
                    recorder.current.start();
                    setAudioRecording(true);
                }

                // setTimeout(function () {
                //     mediaRecorder.stop();
                // }, 2 * 1000);
            });
    };
    console.log(messages);
    return (
        <Layout>
            <Heading mb={4} color='#3f3f3f' display='flex' alignItems='center'>
                Chat House <Icon as={RiWechatLine} ml={4} />
            </Heading>
            <Flex mb={4} flexDirection='row-reverse'>
                <Tag ml='auto' display='inline-flex' alignItems='center'>
                    Online: {onlineNum}
                </Tag>
            </Flex>
            <Stack direction='column'>
                <Textarea
                    ref={txtRef}
                    rows={2}
                    placeholder='Say something...'
                />
                <Flex alignItems='center' justify='center'>
                    <FormLabel> Message </FormLabel>
                    <Flex ml='auto'>
                        <Button
                            type='submit'
                            onClick={sendData}
                            minW={24}
                            colorScheme='messenger'
                            color='white'
                        >
                            Send
                        </Button>
                        <Button
                            type='submit'
                            onClick={handleAudioRecord}
                            ml={4}
                            minW={24}
                            colorScheme={audioRecording ? 'red' : 'messenger'}
                            color='white'
                        >
                            {audioRecording ? 'Stop Recording...' : 'Record'}
                            <Icon as={AiFillAudio} />
                        </Button>
                    </Flex>
                </Flex>
            </Stack>
            <Stack
                flexDir='column-reverse'
                overflowY='scroll'
                maxH={300}
                minH={100}
                marginTop='0.5rem'
            >
                <Box>
                    {messages.map((msg, idx) => (
                        <Message
                            key={idx}
                            data={msg.message || msg}
                            isSent={msg.isSentMessage}
                        />
                    ))}
                </Box>
            </Stack>
        </Layout>
    );
};

export default Chat;
