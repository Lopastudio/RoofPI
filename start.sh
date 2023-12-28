#!/bin/bash
tmux new-session -d -s RoofPI-Frontend 'npm run start'
tmux new-session -d -s RoofPI-Backend 'cd Backend && npm run start'