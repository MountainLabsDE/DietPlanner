# Home Assistant Add-on Fix - Summary

## Problem
The Home Assistant add-on was failing with a 403 error:
```
Can't install ghcr.io/mountainlabsde/dietplanner-aarch64:1.0.0: [403] Head "https://ghcr.io/v2/mountainlabsde/dietplanner-aarch64/manifests/1.0.0": denied
```

## Root Cause
The image naming format in `dietplanner/config.yaml` was incorrect:
- **Original**: `ghcr.io/mountainlabsde/{arch}-addon-dietplanner`
- **Expected**: `ghcr.io/mountainlabsde/dietplanner-{arch}`

The Home Assistant builder workflow was also not configured correctly to build the right image name.

## Changes Made

### 1. Fixed Image Naming Format
- **File**: `dietplanner/config.yaml`
- **Change**: Updated `image` field from `{arch}-addon-dietplanner` to `dietplanner-{arch}`
- **Result**: For aarch64, the image is now `ghcr.io/mountainlabsde/dietplanner-aarch64:1.0.0`

### 2. Updated Dockerfile
- **File**: `dietplanner/Dockerfile`
- **Changes**:
  - Added `bashio` package for Home Assistant integration
  - Copied and set executable `run.sh` script as entrypoint
  - Ensured proper multi-stage build process

### 3. Fixed run.sh Script
- **File**: `dietplanner/run.sh`
- **Changes**:
  - Restored SSL configuration support (with proper validation)
  - Added log level logging
  - Improved error messages and directory creation

### 4. Updated Build Workflow
- **File**: `.github/workflows/build-addon.yml`
- **Changes**:
  - Set `--docker-hub ghcr.io`
  - Set `--image mountainlabsde/dietplanner`
  - Added `BUILD_FROM` environment variable
  - This ensures the workflow builds images matching `config.yaml` format

### 5. Cleaned Up Files
- **Removed**: `dietplanner/addon.json` (duplicate config)
- **Removed**: `dietplanner/Dockerfile.ubuntu` (unused)

## Branch Status

### All Branches Merged
- ✅ `feat/home-assistant-addon` → Merged into `main`
- ✅ `main` → Contains all Home Assistant addon fixes
- ✅ `development` → Fast-forward merged with `main` (includes all fixes)

### Commits Applied
1. `fix: Correct Home Assistant addon image naming format`
2. `fix: Update Home Assistant addon Dockerfile and run script`
3. `fix: Finalize Home Assistant addon configuration`
4. `fix: Update Home Assistant builder workflow`

## Configuration Summary

### Add-on Configuration (`dietplanner/config.yaml`)
```yaml
image: "ghcr.io/mountainlabsde/dietplanner-{arch}"
ingress: true
ingress_port: 3000
panel_icon: "mdi:food"
panel_title: "PlatePulse"
```

### Supported Architectures
- aarch64 (ARM 64-bit)
- amd64 (Intel/AMD 64-bit)
- armv7 (ARM 32-bit)

### Features
- SSL/TLS support (optional)
- Home Assistant Ingress integration
- Custom log levels (info, debug, warning, error)
- Config, Share, and Media directory access

## Next Steps

### Required Actions

1. **Push Changes to GitHub**
   ```bash
   git push origin main
   git push origin development
   ```

2. **Verify GitHub Actions Build**
   - After pushing, the `.github/workflows/build-addon.yml` will automatically run
   - It will build Docker images for all three architectures (aarch64, amd64, armv7)
   - Images will be pushed to `ghcr.io/mountainlabsde/dietplanner-{arch}:1.0.0`

3. **Test Add-on Installation**
   - Wait for GitHub Actions to complete successfully
   - Open Home Assistant Add-on Store
   - Add repository: `https://github.com/MountainLabsDE/DietPlanner`
   - Install and start the add-on

### GitHub Actions Details

The workflow will:
1. Checkout the code
2. Extract version from `dietplanner/config.yaml`
3. Build multi-arch Docker images using Home Assistant Builder
4. Push images to `ghcr.io/mountainlabsde/dietplanner-{arch}:1.0.0`

### Expected Image Names
- `ghcr.io/mountainlabsde/dietplanner-aarch64:1.0.0`
- `ghcr.io/mountainlabsde/dietplanner-amd64:1.0.0`
- `ghcr.io/mountainlabsde/dietplanner-armv7:1.0.0`

### Notes

- The `CAS_API_KEY` secret should be configured in the GitHub repository settings for Home Assistant Builder to work
- Home Assistant automatically injects appropriate GITHUB_TOKEN for pushing to packages
- The workflow triggers on pushes to `main` branch

## Verification

After the build completes, verify the images exist:
```bash
# Check if images are available (requires GHCR access)
curl -s https://ghcr.io/v2/mountainlabsde/dietplanner/tags/list
```

## Support

For issues:
- Check GitHub Actions workflow logs
- Verify `dietplanner/Dockerfile` builds correctly locally
- Ensure `CAS_API_KEY` secret is properly configured
