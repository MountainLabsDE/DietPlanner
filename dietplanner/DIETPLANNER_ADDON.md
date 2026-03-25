# PlatePulse Diet Planner Add-on

AI-powered meal planning and nutrition tracking for Home Assistant.

## Features

- **Intelligent Meal Planning**: AI-powered meal generation with customizable calorie targets and macronutrient distribution
- **Flexible Diet Profiles**: Support for vegan, keto, vegetarian, and custom diet combinations
- **Comprehensive Tracking**: Real-time calorie and macro tracking with visual progress indicators
- **Barcode Scanner**: Instant product compatibility verification via camera
- **Recipe Database**: Extensive collection with detailed nutritional information
- **Multiple Export Formats**: PDF, JSON, CSV, and API access
- **Mobile-First Design**: Responsive interface optimized for all devices
- **Home Assistant Integration**: Seamless integration with your smart home ecosystem

## Installation

1. Open Home Assistant
2. Go to **Settings** → **Add-ons** → **Add-on Store**
3. Click the three dots in the top right corner → **Add repository**
4. Enter: `https://github.com/MountainLabsDE/DietPlanner`
5. Click **Add**
6. Browse the add-on store and install **PlatePulse Diet Planner**

## Configuration

After installation, configure the add-on:

```yaml
log_level: info  # info, debug, warning, or error
ssl: false  # Set to true to enable SSL
certfile: fullchain.pem  # SSL certificate file
keyfile: privkey.pem  # SSL key file
jwt_secret: ""  # Auto-generated on first run if left empty
jwt_expiration: "15m"  # JWT access token expiration time
jwt_refresh_expiration: "7d"  # JWT refresh token expiration time
openai_api_key: ""  # OpenAI API key for AI-powered features (optional)
openai_base_url: ""  # Custom OpenAI-compatible API base URL (e.g., for Azure, local models, etc.)
port: 3000  # Port for the application
database_url: "postgresql://homeassistant:homeassistant@core-postgresql:5432/platepulse"
```

### Configuration Options

- **log_level**: Set the logging verbosity (info, debug, warning, error)
- **ssl**: Enable SSL/TLS for secure connections
- **certfile**: Path to SSL certificate file (when SSL is enabled)
- **keyfile**: Path to SSL private key file (when SSL is enabled)
- **jwt_secret**: Secret key for JWT token authentication. If left empty, a random secret will be generated and saved to /data/.jwt_secret on first run. For production use, it's recommended to set a specific secret.
- **jwt_expiration**: Time until access tokens expire (e.g., "15m", "1h", "24h")
- **jwt_refresh_expiration**: Time until refresh tokens expire (e.g., "7d", "30d")
- **openai_api_key**: OpenAI API key for AI-powered meal planning (optional).
- **openai_base_url**: Custom API base URL for OpenAI-compatible services (Azure OpenAI, groq, local LLMs, etc.). Leave empty for default OpenAI API.
- **database_url**: PostgreSQL database connection string. **Defaults to Home Assistants built-in PostgreSQL**, so it works out-of-the-box. Change only for custom setups.
- **port**: Port on which the application will listen (default: 3000)

### Web Interface

Once started, access the web interface at:
- **Home Assistant**: Click "Open Web UI" in the add-on menu
- **Direct access**: `http://homeassistant.local:3000` (replace with your Home Assistant URL)

## Requirements

- Home Assistant Core 2024.1.0 or later
- Architectures: aarch64, amd64, armv7
- 512MB RAM minimum (1GB recommended)
- 1GB disk space

## Support

For issues, questions, or support:
- **GitHub Issues**: https://github.com/MountainLabsDE/DietPlanner/issues
- **Website**: https://www.mountainlabs.eu
- **Email**: contact@mountainlabs.eu

## License

Copyright © 2024 MountainLabs UG. All rights reserved.

## Developer Documentation

For detailed documentation on the application architecture, API, and development:
- See the [`.development`](../.development) folder in the repository
- [Design Document](../.development/docs/design-document.md)
- [API Documentation](../.development/docs/api.md)
- [Architecture Overview](../.development/docs/architecture.md)
