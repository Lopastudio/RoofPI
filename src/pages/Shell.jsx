import React, { useState } from 'react';
import axios from 'axios';

function Shell() {
  const [sshData, setSshData] = useState({
    host: '',
    port: '',
    username: '',
    password: '',
    command: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSshData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSSHSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3010/ssh', sshData);
      console.log(response.data); // Handle the response from the SSH command here
    } catch (error) {
      console.error('Error sending SSH command', error);
    }
  };

  return (
    <div className="Appenos">
      <h1>Shell</h1>
      <form onSubmit={handleSSHSubmit}>
        <input type="text" name="host" placeholder="Host" onChange={handleInputChange} />
        <input type="text" name="port" placeholder="Port" onChange={handleInputChange} />
        <input type="text" name="username" placeholder="Username" onChange={handleInputChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleInputChange} />
        <input type="text" name="command" placeholder="Command" onChange={handleInputChange} />
        <button type="submit">Execute SSH Command</button>
      </form>
    </div>
  );
}

export default Shell;
