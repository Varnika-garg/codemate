import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Rooms() {
    const navigate = useNavigate();
    const [roomName, setRoomName] = useState("");
    const [roomCode, setRoomCode] = useState("");

    const token = localStorage.getItem("token");

    const createRoom = async () => {
        try {
            const res = await axios.post(
                "http://localhost:5000/api/rooms/create",
                { roomName },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            navigate(`/room/${res.data.roomCode}`);
        } catch (error) {
            console.log(error);
        }
    };

    const joinRoom = async () => {
        try {
            const res = await axios.post(
                "http://localhost:5000/api/rooms/join",
                { roomCode },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            navigate(`/room/${res.data.roomCode}`);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div style={{ padding: "30px" }}>

            <h1>Rooms</h1>

            <hr />

            <h2>Create Room</h2>

            <input
                type="text"
                placeholder="Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
            />

            <button onClick={createRoom}>
                Create Room
            </button>

            <hr />

            <h2>Join Room</h2>

            <input
                type="text"
                placeholder="Enter Room Code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
            />

            <button onClick={joinRoom}>
                Join Room
            </button>

        </div>
    );
}

export default Rooms;