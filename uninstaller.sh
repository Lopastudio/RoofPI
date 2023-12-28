#!/bin/bash

# Ensure the script is run with sudo
if [ "$EUID" -ne 0 ]; then
    echo "Please run the uninstaller as root or using sudo."
    exit 1
fi
echo "This script will remove all data and RoofPI from your Raspberry Pi"
echo "Do you really want to uninstall RoofPI? (Y/N): "
read installYN

if [ "$installYN" = "Y" ] || [ "$installYN" = "y" ]; then
    install_directory="/var/www/roofpi/"

    # Stop and disable the RoofPi service
    systemctl stop roofpi.service
    systemctl disable roofpi.service

    # Stop and disable the RoofPi Backend service
    systemctl stop roofpi_backend.service
    systemctl disable roofpi_backend.service

    # Remove the systemd service files
    rm /etc/systemd/system/roofpi.service
    rm /etc/systemd/system/roofpi_backend.service

    # Remove the installation directory
    rm -rf "$install_directory"

    echo "Uninstallation completed successfully."
else
    ecjp "Thanks for leaving this beautiful piece of software on your Pi. "
fi
