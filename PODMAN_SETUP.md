# Podman Setup Guide (Free Docker Alternative)

## Why Podman?

- ✅ **100% Free** - No licensing fees, even for commercial use
- ✅ **Docker Compatible** - Uses same commands and Compose files
- ✅ **Rootless** - More secure, runs without admin privileges
- ✅ **No Daemon** - Lighter weight than Docker
- ✅ **Open Source** - Fully open source (Apache 2.0)

**Docker Desktop requires a paid license for:**
- Companies with >250 employees
- Companies with >$10M revenue
- Commercial use in large organizations

**Podman is free for everyone, always.**

---

## Installation

### Windows

1. **Download Podman Desktop**
   - Visit: https://podman-desktop.io/
   - Download Windows installer
   - Run installer (requires admin)

2. **Initialize Podman Machine**
   ```powershell
   # First time setup
   podman machine init
   podman machine start
   
   # Verify installation
   podman --version
   podman ps
   ```

3. **Install podman-compose**
   ```powershell
   pip install podman-compose
   
   # Verify
   podman-compose --version
   ```

### macOS

```bash
# Using Homebrew
brew install podman podman-compose

# Initialize machine
podman machine init
podman machine start
```

### Linux

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install podman podman-compose

# Fedora/RHEL
sudo dnf install podman podman-compose

# Arch
sudo pacman -S podman podman-compose
```

---

## Using Podman with This Project

### Option 1: Direct Replacement (Recommended)

Create PowerShell aliases:

```powershell
# Add to your PowerShell profile
# Location: ~\Documents\PowerShell\Microsoft.PowerShell_profile.ps1

Set-Alias -Name docker -Value podman
Set-Alias -Name docker-compose -Value podman-compose
```

Now all `docker` and `docker-compose` commands work automatically!

### Option 2: Use Podman Commands Directly

```powershell
# Instead of: docker-compose up -d
podman-compose up -d

# Instead of: docker ps
podman ps

# Instead of: docker-compose logs
podman-compose logs
```

---

## Quick Start

```powershell
# 1. Start Podman machine (if not running)
podman machine start

# 2. Start project services
cd wedding-media-platform
podman-compose up -d

# 3. Verify services
podman-compose ps

# 4. View logs
podman-compose logs -f

# 5. Stop services
podman-compose down
```

---

## Common Commands

### Machine Management
```powershell
# Start Podman machine
podman machine start

# Stop Podman machine
podman machine stop

# Check machine status
podman machine list

# SSH into machine (if needed)
podman machine ssh
```

### Container Management
```powershell
# List running containers
podman ps

# List all containers
podman ps -a

# Stop a container
podman stop <container-name>

# Remove a container
podman rm <container-name>

# View container logs
podman logs <container-name>

# Execute command in container
podman exec -it <container-name> bash
```

### Compose Management
```powershell
# Start services
podman-compose up -d

# Stop services
podman-compose down

# Rebuild and start
podman-compose up -d --build

# View logs
podman-compose logs -f

# Restart a service
podman-compose restart postgres
```

### Image Management
```powershell
# List images
podman images

# Pull an image
podman pull postgres:15-alpine

# Remove an image
podman rmi <image-name>

# Clean up unused images
podman image prune
```

---

## Troubleshooting

### Podman Machine Won't Start

```powershell
# Remove and recreate machine
podman machine stop
podman machine rm
podman machine init
podman machine start
```

### Port Already in Use

```powershell
# Find process using port
netstat -ano | findstr :5432

# Kill process
taskkill /PID <PID> /F

# Or change port in docker-compose.yml
```

### Permission Issues (Linux)

```powershell
# Enable rootless mode
podman system migrate

# Or run with sudo (not recommended)
sudo podman-compose up -d
```

### Slow Performance (Windows/macOS)

```powershell
# Increase machine resources
podman machine stop
podman machine set --cpus 4 --memory 4096
podman machine start
```

---

## Differences from Docker

### What's the Same:
- ✅ All `docker` commands work (just replace with `podman`)
- ✅ Uses same Dockerfile syntax
- ✅ Uses same docker-compose.yml format
- ✅ Compatible with Docker Hub images
- ✅ Same networking and volumes

### What's Different:
- ⚠️ No daemon (containers run directly)
- ⚠️ Rootless by default (more secure)
- ⚠️ Slightly different machine management on Windows/macOS
- ⚠️ Some Docker Desktop GUI features not available (use Podman Desktop instead)

---

## Podman Desktop Features

Podman Desktop provides a GUI similar to Docker Desktop:

- 📊 Container dashboard
- 📈 Resource monitoring
- 🔍 Log viewer
- 🖼️ Image management
- 🔧 Compose file editor
- 🚀 Kubernetes integration

**Access**: Open Podman Desktop application after installation

---

## Migration from Docker Desktop

If you're switching from Docker Desktop:

1. **Export existing containers** (if needed):
   ```powershell
   docker export <container> > container.tar
   ```

2. **Uninstall Docker Desktop**

3. **Install Podman Desktop**

4. **Import containers** (if needed):
   ```powershell
   podman import container.tar
   ```

5. **Update aliases** (see above)

6. **Start using Podman!**

---

## Resources

- **Official Website**: https://podman.io/
- **Podman Desktop**: https://podman-desktop.io/
- **Documentation**: https://docs.podman.io/
- **GitHub**: https://github.com/containers/podman
- **Comparison**: https://docs.podman.io/en/latest/markdown/podman.1.html#podman-vs-docker

---

## FAQ

**Q: Is Podman really free for commercial use?**  
A: Yes, 100% free. Apache 2.0 license, no restrictions.

**Q: Will my docker-compose.yml work with Podman?**  
A: Yes, podman-compose is compatible with Docker Compose files.

**Q: Can I use Docker images with Podman?**  
A: Yes, Podman can pull and run Docker Hub images.

**Q: Is Podman slower than Docker?**  
A: No, often faster due to no daemon overhead.

**Q: Can I run both Docker and Podman?**  
A: Yes, but they use different sockets. Use aliases to switch.

**Q: Does Podman work on Windows?**  
A: Yes, via WSL2 or Podman machine (similar to Docker Desktop).

---

**Recommendation**: Use Podman for this project to avoid Docker Desktop licensing costs.
