# Web Programming HW03
Web Programming coure, HW03.

## Files
Back-end

## How to deploy
1. Clone repository.
2. Run `npm install` to install all dependencies.
3. Configure NGINX:
```
server {
    listen 80;
    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
     }
}
```
4. Add this service to CentOS (Replace /path/to/ with correct path):
```
[Unit]
Description=node-app

[Service]
Type=simple
Restart=always
RestartSec=2s
Environment=PORT=80
ExecStart=/usr/bin/node /root/path/to/index.js

[Install]
WantedBy=multi-user.target
```
5. Make sure system service and nginx are running currectly.
6. All Done!

## People
Instructor: Mr. Omid Jafari-Nezhad

| Name | Student Number |
| :-: | :-: |
| Aryan Ahadinia | 98103878 |
| Mohammad Jafari | 98105654 |
| Pourya Momtaz | 98106061 |
