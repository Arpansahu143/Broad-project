# Phase 1 — Continuous Deployment Setup Guide

This covers wiring Jenkins up to actually deploy to EC2 after it builds and pushes images — the pieces that need real AWS/Jenkins access to set up, which I can't do from here.

## 1. Launch the EC2 server

In the AWS Console:
1. **EC2 → Launch Instance**
2. Ubuntu 24.04 LTS
3. Instance type: `t3.small` is a reasonable minimum for this stack (Postgres + backend + frontend all on one box)
4. Create/select a key pair — download the `.pem` file, you'll need it
5. Security group: allow inbound **22** (SSH), **3000** (frontend), and **22** again from Jenkins specifically if Jenkins runs elsewhere — for now, allow your IP and Jenkins' IP on 22, and 3000 from anywhere
6. Launch, note the **public IP**

## 2. Install Docker on the EC2 instance

SSH in:
```bash
ssh -i your-key.pem ubuntu@YOUR_EC2_IP
```
Install Docker:
```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```
Log out and back in for the group change to apply, then confirm:
```bash
docker --version
docker compose version
```

## 3. Clone the project onto EC2 (one-time)

```bash
git clone https://github.com/Arpansahu143/Broad-project.git
cd Broad-project
cp .env.example .env
nano .env
```
Fill in real values — `POSTGRES_PASSWORD`, and generate both JWT secrets:
```bash
openssl rand -hex 32
```
Run twice, paste into `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET`.

**Do a manual first deploy** to confirm everything works before handing it to Jenkins:
```bash
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml logs -f backend
```
Visit `http://YOUR_EC2_IP:3000` — confirm the app loads.

## 4. Set up SSH access from Jenkins to EC2

Generate a dedicated deploy key (don't reuse personal keys), on the Jenkins server or your local machine:
```bash
ssh-keygen -t ed25519 -C "jenkins-deploy" -f jenkins_deploy_key -N ""
```
Add the **public** key to EC2:
```bash
ssh-copy-id -i jenkins_deploy_key.pub ubuntu@YOUR_EC2_IP
```

## 5. Add credentials to Jenkins

In Jenkins: **Manage Jenkins → Credentials → System → Global credentials → Add Credentials**. Add these four:

| Kind | ID | Value |
|---|---|---|
| SSH Username with private key | `ec2-deploy-key` | Username: `ubuntu`, paste the **private** key (`jenkins_deploy_key`'s contents) |
| Secret text | `ec2-host` | Your EC2's public IP |
| Secret text | `ec2-user` | `ubuntu` |
| Secret text | `ec2-project-path` | `/home/ubuntu/Broad-project` (wherever you cloned it) |

You should already have `dockerhub` credentials from the existing CI stages — no change needed there.

## 6. Install the Jenkins SSH Agent plugin

**Manage Jenkins → Plugins → Available plugins** → search "SSH Agent" → install. The updated `Jenkinsfile`'s Deploy stage depends on this.

## 7. Trigger a build and verify

Push a commit, let Jenkins run through Build → Push → Deploy. Watch the Jenkins console output for the Deploy stage — it should SSH in, pull, and restart containers. Then:
```bash
ssh -i your-key.pem ubuntu@YOUR_EC2_IP
docker compose -f docker-compose.prod.yml ps
```
All three containers should show `healthy`/`Up`.

## What changed in the Jenkinsfile

- Images now tag with the Jenkins build number **and** `latest` (previously a static `v1` that just got silently overwritten every build — no way to identify or roll back to a specific previous version)
- New **Deploy to EC2** stage — SSHs in, pulls latest code + images, restarts via `docker-compose.prod.yml`

## What's new: `docker-compose.prod.yml`

Your existing `docker-compose.yml` builds from source — good for local dev, but slow and pointless on a server that should just run pre-built images. This new file pulls `arpansahu/mis-backend`/`arpansahu/mis-frontend` from Docker Hub instead. Both files coexist; use `-f docker-compose.yml` locally, `-f docker-compose.prod.yml` on EC2.
