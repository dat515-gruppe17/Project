#!/bin/bash

# Update package list
sudo apt-get update
sudo apt upgrade
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo systemctl enable docker
sudo systemctl start docker
docker --version
docker pull httpd