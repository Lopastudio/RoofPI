#!/bin/bash

clear



# Colour initialization
F_BOLD="\033[1m"
C_GREEN="\033[38;5;2m"
C_OLIVE="\033[38;5;3m"
C_RED="\033[38;5;9m"
C_DARKVIOLET="\033[38;5;92m"
C_DARKBLUE="\033[38;5;18m"
C_MAROON="\033[38;5;1m"
NO_FORMAT="\033[0m"

# Check if the script is run with sudo
if [ "$EUID" -ne 0 ]; then
    printf "${F_BOLD}${C_RED}Installation aborted == ERROR OCCURRED!\n${NO_FORMAT}"
    printf "${C_GREEN}Please run the installer as root or using sudo.\n\n\n${NO_FORMAT}"
    exit 1
fi

printf "${F_BOLD}${C_OLIVE}RoofPi Easy installer${NO_FORMAT}\n\n"
printf "${F_BOLD}${C_DARKVIOLET}Written with ${C_MAROON}❤️${C_DARKVIOLET} by Patrik Nagy (lopastudio.sk / https://github.com/Lopastudio)${NO_FORMAT}\n"
printf "${F_BOLD}${C_DARKBLUE}Copyright (c) 2023${NO_FORMAT}\n\n\n"

printf "Do you want to start the installation? (Y/N): "
read installYN

if [ "$installYN" = "Y" ] || [ "$installYN" = "y" ]; then
    printf "${F_BOLD}${C_OLIVE}Installation started${NO_FORMAT}\n${NO_FORMAT}"

    printf "\n\n\n${F_BOLD}${C_GREEN}apt update && apt upgrade\n${NO_FORMAT}"
    apt-get update && apt upgrade # Update the machime (Raspberry Pi)

    printf "\n\n\n${F_BOLD}${C_GREEN}apt install tmux -y\n${NO_FORMAT}"
    apt install tmux -y # Install Tmux for running in background

    printf "\n\n\n${F_BOLD}${C_GREEN}apt install git -y\n${NO_FORMAT}"
    apt install git -y # Install GIT to, well, download the latest version of RoofPI from github

    printf "\n\n\n${F_BOLD}${C_GREEN}curl -sL https://deb.nodesource.com/setup_18.x | bash -\n${NO_FORMAT}"
    curl -sL https://deb.nodesource.com/setup_18.x | sudo bash - # Execute nodejs 18 install script

    printf "\n\n\n${F_BOLD}${C_GREEN}apt install nodejs -y\n${NO_FORMAT}"
    apt install nodejs -y # And now, installing nodejs

    printf "\n\n\n${F_BOLD}${C_GREEN}node -v\n${NO_FORMAT}"
    node -v # Displaying nodejs version (should output v18 something...)

    # End of commenting. I am lazy :/

    install_directory="/var/www/roofpi/"
    install_directory_backend="/var/www/roofpi/backend/"

    if [ -d "$install_directory" ]; then
        printf "\n\n\n${F_BOLD}${C_RED}Directory /var/www/roofpi/ already exists.${NO_FORMAT}\n"
        read -p "Do you want to erase the directory and continue with the installation? (Y/N): " eraseDir

        if [ "$eraseDir" = "Y" ] || [ "$eraseDir" = "y" ]; then
            printf "\n\n\n${F_BOLD}${C_GREEN}Erasing directory /var/www/roofpi/ and continuing with the installation.${NO_FORMAT}\n"
            rm -rf "$install_directory"
        else
            printf "${C_RED}Installation aborted. Please choose a different installation directory.${NO_FORMAT}\n"
            exit 1
        fi
    fi

    printf "\n\n\n${F_BOLD}${C_GREEN}mkdir /var/www/roofpi/\n${NO_FORMAT}"
    mkdir "$install_directory"

    printf "\n\n\n${F_BOLD}${C_GREEN}git clone https://github.com/Lopastudio/RoofPI.git /var/www/roofpi\n${NO_FORMAT}"
    git clone https://github.com/Lopastudio/RoofPI.git "$install_directory"

    printf "\n\n\n${F_BOLD}${C_GREEN}cd /var/www/roofpi/\n${NO_FORMAT}"
    cd "$install_directory"

    printf "\n\n\n${F_BOLD}${C_GREEN}npm install\n${NO_FORMAT}"
    npm install

    # If you really want, you can enable it, but it is not necessary
    #printf "\n\n\n${F_BOLD}${C_GREEN}npm audit fix --force\n${NO_FORMAT}"
    #npm audit fix --force

    printf "\n\n\n${F_BOLD}${C_GREEN}chmod +x start.sh\n${NO_FORMAT}"
    chmod +x start.sh

    printf "\n\n\n${F_BOLD}${C_GREEN}chmod +x kill.sh\n${NO_FORMAT}"
    chmod +x kill.sh

    printf "\n\n\n${F_BOLD}${C_GREEN}cd /var/www/roofpi/\n${NO_FORMAT}"
    cd "$install_directory_backend"

    printf "\n\n\n${F_BOLD}${C_GREEN}npm install\n${NO_FORMAT}"
    npm install

    printf "\n\n\n${F_BOLD}${C_GREEN}Creating systemd service file...\n${NO_FORMAT}"

    # Create systemd service file with 'EOF' delimiter
    cat <<EOF >/etc/systemd/system/roofpi.service
[Unit]
Description=RoofPi Service
After=network.target

[Service]
ExecStart=/var/www/roofpi/start.sh
WorkingDirectory=/var/www/roofpi/
Restart=always
User=root

[Install]
WantedBy=multi-user.target
EOF

    printf "\n\n\n${F_BOLD}${C_GREEN}Enabling and starting the RoofPi service...\n${NO_FORMAT}"

    # Enable and start the service
    systemctl enable roofpi.service
    systemctl start roofpi.service

    printf "\n\n\n${F_BOLD}${C_GREEN}Installation completed successfully.${NO_FORMAT}\n"
else
    printf "${C_RED}Installation aborted.${NO_FORMAT}\n"
fi
