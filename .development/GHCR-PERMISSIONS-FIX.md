# GHCR Package Creation Issue - Setup Required

## Current Status

✅ **Docker Build:** Succeeding!
✅ **Multi-stage Build:** Working!
✅ **All Preventive Measures:** Applied!
❌ **GHCR Push:** Denied - organization permissions

## Error Details

```
Error: failed to push ghcr.io/mountainlabsde/dietplanner-amd64:1.0.0
Message: denied: installation not allowed to Create organization package
```

## Root Cause

The GitHub Actions workflow cannot create packages in the `mountainlabsde` organization.

This is a **GitHub organization-level permission setting**, not a repository setting.

## Solution Required

### Option 1: Enable Package Creation in Organization (Recommended)

**Steps:**

1. **Log into GitHub** as organization owner/admin
2. **Navigate to:** Organization Settings
   - Go to: https://github.com/organizations/MountainLabsDE/settings
   - Or: Click your avatar → Your Organizations → MountainLabsDE → Settings

3. **Find Package Registry Settings:**
   - Look for: "Actions" → "General" or "Packages" section
   - Tab: "Actions" → "General"

4. **Enable Package Creation:**
   - Find: "Workflow permissions" or "Package registry permissions"
   - Enable: "Allow GITHUB_TOKEN to create packages"
   - Or: "Allow workflows to create packages in this organization"

5. **Save Changes**

### Option 2: Update Workflow to Use Personal Token

If you can't enable organization packages:

1. **Create Personal Access Token (PAT):**
   - Go to: https://github.com/settings/tokens
   - Generate new token with `write:packages` scope
   - Copy the token

2. **Add as Secret to Organization:**
   - Go to: Organization → Settings → Secrets and variables → Actions
   - Name: `GITHUB_TOKEN` (or `PAT_TOKEN`)
   - Paste your personal access token

3. **Update Workflow:**
   - Change: `${{ secrets.GITHUB_TOKEN }}`
   - To: `${{ secrets.PAT_TOKEN }}`

### Option 3: Use Different Registry

If you can't enable GHCR packages:

1. **Use Docker Hub instead:**
   - Change workflow to push to: `docker.io/mountainlabsde/dietplanner`

2. **Change config.yaml image:**
   - From: `ghcr.io/mountainlabsde/dietplanner-{arch}`
   - To: `docker.io/mountainlabsde/dietplanner-{arch}`

## Temporary Workaround (Option 1 Not Available)

If you can't change organization settings right now:

### Build Images Locally

```bash
# Build images locally for all architectures
cd dietplanner
docker buildx build \
  --platform linux/amd64 \
  --tag dietplanner-amd64:1.0.0 \
  --file Dockerfile \
  --build-type=local \
  --build-arg BUILD_FROM=ghcr.io/home-assistant/amd64-base:3.18 \
  --load .

# Load and tag
docker tag dietplanner-amd64:1.0.0 ghcr.io/mountainlabsde/dietplanner-amd64:1.0.0

# Login to GHCR
echo "YOUR_GITHUB_TOKEN" | docker login ghcr.io -u MountainLabsDE --password-stdin

# Push
docker push ghcr.io/mountainlabsde/dietplanner-amd64:1.0.0
```

*Note: You need appropriate permissions to push to GHCR.*

## Verification Steps

### After Enabling Organization Packages

1. **Re-run workflow manually:**
   - Go to: https://github.com/MountainLabsDE/DietPlanner/actions
   - Find: "Build Home Assistant Add-on" workflow
   - Click: "Run workflow" button (right side)

2. **Watch build:**
   - Should see: "Build and push" jobs turn green ✅
   - No more "denied: installation not allowed" errors

3. **Verify images in GHCR:**
   - Go to: https://github.com/MountainLabsDE?tab=packages
   - Should see: dietplanner-aarch64:1.0.0
   - Should see: dietplanner-amd64:1.0.0
   - Should see: dietplanner-armv7:1.0.0

## Workflow Permissions Already Set

The workflow already has:
```yaml
name: Build Home Assistant Add-on

on:
  push:
    branches:
      - main
```

*Note: But this doesn't give organization package creation rights.*

**What's needed:** Organization-level package creation permission.

## Troubleshooting

### If Still "Denied" After Enabling

1. **Check workflow permissions in org settings:**
   - GitHub → Organization → Settings → Actions → General
   - "Workflow permissions": Should be "Read and write permissions"
   - "Package registry": Should be enabled

2. **Check secret scope:**
   - GITHUB_TOKEN should have: `write:packages` scope
   - Check at: https://github.com/organizations/MountainLabsDE/settings/secrets/actions

3. **Verify organization ownership:**
   - You must be owner/admin of MountainLabsDE
   - Regular member accounts can't enable package creation

### Alternative: Use Docker Hub

If GitHub Container Registry issues persist:

1. **Create Docker Hub account:** https://hub.docker.com/
2. **Create organization:** `mountainlabsde`
3. **Update workflow,** build-addon.yml:
   ```yaml
   # Change:
   --docker-hub ghcr.io
   # To:
   --docker-hub registry-1.docker.io
   ```

4. **Update image name in config.yaml:**
   ```yaml
   # Change:
   image: "ghcr.io/mountainlabsde/dietplanner-{arch}"
   # To:
   image: "docker.io/mountainlabsde/dietplanner-{arch}"
   ```

## Next Steps

### Once Package Creation Works

1. Re-run GitHub Actions workflow
2. Images push successfully to GHCR
3. Home Assistant addon installs without 403 error
4. Success! 🎉

## Summary

| Issue | Status | Solution |
|-------|--------|----------|
| ✅ Docker build | SUCCESS | All fixes applied |
| ✅ Multi-stage | SUCCESS | No more building errors |
| ✅ Preventive measures | SUCCESS | Error handling, logging, verification |
| ❌ GHCR permissions | BLOCKING | Org package creation disabled |
| ❌ 403 error in HA | BLOCKING | Images not in GHCR yet |

**Primary blocker:** GitHub organization package creation permission

**Required action:** Enable in organization settings OR use alternative registry
