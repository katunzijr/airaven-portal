## Deploy command
### On server
ssh-keygen -t ed25519 -C "airaven-portal-deploy-key" -f ~/.ssh/airaven-portal-deploy-key
cat ~/.ssh/airaven-portal-deploy-key.pub

### On github
GitHub repo → Settings → Deploy Keys → Read-only
paste the ~/.ssh/airaven-portal-deploy-key.pub

### On server
nano ~/.ssh/config
```
Host github-airaven-portal
  HostName github.com
  User git
  IdentityFile ~/.ssh/airaven-portal-deploy-key
```
ssh -T git@github-airaven-portal OR ssh -i ~/.ssh/airaven-portal-deploy-key -T git@github.com
mkdir /var/apps
cd /var/apps
git clone git@github-airaven-portal:katunzijr/airaven-portal.git

### Server
sudo lsof /var/lib/apt/lists/lock
lsof -ti:3000 | xargs kill -9 2>/dev/null; echo "Cleared port 3000"
kill -9 $(lsof -t -i:3000)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt update
sudo apt upgrade -y
sudo apt-get install -y nodejs
sudo apt install git -y
sudo npm install -g pm2

pm2 save
pm2 startup
pm2 log airaven-portal --lines 100

### Local
ssh-keygen -t ed25519 -C "github-action" -f ~/.ssh/airaven-portal
ls -l ~/.ssh/
cat ~/.ssh/airaven-portal.pub
cat ~/.ssh/airaven-portal

### Server
mkdir -p ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys
paste the ~/.ssh/airaven-portal-deploy-key.pub
chmod 600 ~/.ssh/authorized_keys

### Local
ssh -i ~/.ssh/airaven-portal root@XX.XX.XX.XX

### GitHub repo → Settings → Secrets and variables → Actions → New repository secret:
HOST → XX.XX.XX.XX
USERNAME → root
PRIVATE_KEY → private key (~/.ssh/id_ed25519)
APP_DIR → /var/apps/airaven-portal

### Server
nginx -version
apt-get install nginx
apt install -y certbot python3-certbot-nginx
nano /etc/nginx/sites-available/default

server {
    listen 80;
    listen [::]:80;

    server_name airaven.co.tz;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

ping airaven.co.tz
sudo certbot --nginx -d airaven.co.tz
nginx -t && nginx -s reload