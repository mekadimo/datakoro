# Server pre-release test install

IMPORTANT NOTE: This guide will only exist during the 0.1 pre-release period;
if you want to try Datakoro, just install it automatically in your own computer
using a dev-container inside VS Code.

Datakoro should work on any system supported by Docker. Assuming a single fresh
Debian server, we can install a full working Datakoro by following these steps:

## 1. Server

```sh
sudo apt update && sudo apt upgrade

sudo vim /etc/hostname
# write domain

sudo dpkg-reconfigure locales
# en_US.UTF-8

sudo vim /etc/environment
# LANG=en_US.UTF-8
# LC_ALL=en_US.UTF-8
# LC_MESSAGES=en_US.UTF-8

sudo reboot
# reboot and login again

sudo apt install git make

sudo apt install ufw

sudo ufw allow 80/tcp

sudo ufw allow 443/tcp

sudo ufw allow ssh

sudo ufw enable

sudo ufw status
# check firewall status
```

## 2. Docker

```sh
sudo apt install ca-certificates curl

sudo install -m 0755 -d /etc/apt/keyrings

sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc

sudo chmod a+r /etc/apt/keyrings/docker.asc

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update

sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

## 3. Datakoro

```sh
sudo mkdir -p /srv/certbot/etc/letsencrypt

sudo chmod -R 777 /srv/certbot/etc/letsencrypt

sudo mkdir -p /srv/certbot/var/www/certbot

sudo chmod -R 777 /srv/certbot/var/www/certbot

cd /srv

sudo git clone https://github.com/mekadimo/datakoro

sudo chmod -R 777 /srv/datakoro

cd /srv/datakoro

sudo rm -f /srv/nginx.conf

sudo cp /srv/datakoro/nginx.prod.conf /srv/nginx.conf

sudo chmod -R 777 /srv/nginx.conf

sed -i 's/CERTBOT_DOMAIN/datakoro.net/g' /srv/nginx.conf

sudo cp .env /srv/.env.prod

sudo chmod -R 777 /srv/.env.prod

vim /srv/.env.prod
# write production values

sed -i 's/RUN_SERVER=true/RUN_SERVER=false/g' /srv/.env.prod

sudo cp datakoro.service /etc/systemd/system/datakoro.service

sudo systemctl daemon-reload

sudo systemctl start datakoro

# wait a few minutes until containers are built

sudo systemctl status datakoro

sudo docker exec -it datakoro-server bash -c "cd /srv/datakoro && make install migrate"

sudo systemctl stop datakoro

sed -i 's/RUN_SERVER=false/RUN_SERVER=true/g' /srv/.env.prod

sudo systemctl enable datakoro

sudo systemctl start datakoro

sudo systemctl status datakoro
```

## 3.1. Datakoro (reset)

In order to update AND reset Datakoro on the server:

```sh
sudo systemctl stop datakoro

sudo systemctl disable datakoro

sudo docker system prune -a

sudo docker volume rm $(sudo docker volume ls -q)

sudo rm -Rf /srv/datakoro

cd /srv

sudo git clone https://github.com/mekadimo/datakoro

sudo chmod -R 777 /srv/datakoro

cd /srv/datakoro

sudo rm -f /srv/nginx.conf

sudo cp /srv/datakoro/nginx.prod.conf /srv/nginx.conf

sudo chmod -R 777 /srv/nginx.conf

sed -i 's/CERTBOT_DOMAIN/datakoro.net/g' /srv/nginx.conf

sed -i 's/RUN_SERVER=true/RUN_SERVER=false/g' /srv/.env.prod

sudo systemctl start datakoro

# wait a few minutes until containers are built

sudo systemctl status datakoro

sudo docker exec -it datakoro-server bash -c "cd /srv/datakoro && make install migrate"

sudo systemctl stop datakoro

sed -i 's/RUN_SERVER=false/RUN_SERVER=true/g' /srv/.env.prod

sudo systemctl enable datakoro

sudo systemctl start datakoro

sudo systemctl status datakoro
```
