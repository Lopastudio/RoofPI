#!/bin/bash

# Use ifconfig to get the local IP address
local_ip_address=$(ip a | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1')

# Display the local IP address
echo "Your local IP address is: $local_ip_address"
