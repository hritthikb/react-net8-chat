import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // bootstarap css
import WaitingRoom from './components/waitingroom';
import { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import ChatRoom from './components/chatroom';
function App() {
    //state to check connection
    const[conn, setConnection] = useState();
    const [messages, setMessages] = useState([]);

    //function to join chatroom
    const joinChatRoom = async (username, chatroom) => {
        try{
            //initate socket connection
            const conn = new HubConnectionBuilder()
                .withUrl('http://localhost:5200/chat') 
                .configureLogging(LogLevel.Information)
                .build();
            //handle connection

            conn.on("JoinSpecificChatRoom", (username, msg) => {
                console.log("username: ", username);
                
            });

            // handle connection
            conn.on("ReceiveSpecificMessage", (user, message) => {
                setMessages(messages => [...messages, { username: user, msg: message }]);
            });

            //start connection
            await conn.start();
            await conn.invoke("JoinSpecificChatRoom", { username, chatroom });

            //set connection
            setConnection(conn);

        }
        catch(err){
            console.log(err);
        }
    }

    const sendMessage = async(message) =>{
      try {
        await conn.invoke("SendMessage", message);
      } catch (e) {
        console.log(e);
        
      }
    }

    return (
        <div>
            <main>
                <Container>
                    <Row className='px-5 my-5'> {/* Use className instead of class */}
                        <Col sm='12'>
                            <h1 className='font-weight-light'>Welcome to F1 chat app</h1>
                        </Col>
                    </Row>

                    { !conn 
                      ? <WaitingRoom joinChatRoom={joinChatRoom} /> 
                      : <ChatRoom messages={messages} sendMessage={sendMessage} />
                    }
                </Container>
            </main>
        </div>
    );
}

export default App;
