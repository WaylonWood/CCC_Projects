# San Diego Top Spots

A web application showing the top attractions in San Diego with interactive map and filtering capabilities.

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/WaylonWood/CCC_Projects/tree/main/web102-san-deigo-top-spots
cd web102-san-diego-top-spots
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Google Maps API Key

**IMPORTANT: Never commit your actual API key to GitHub!**

1. Copy the configuration template:
   ```bash
   cp config.example.js config.js
   ```

2. Edit `config.js` and replace `YOUR_API_KEY_HERE` with your actual Google Maps API key:
   ```javascript
   const CONFIG = {
       GOOGLE_MAPS_API_KEY: 'your-actual-api-key-here'
   };
   ```

3. The `config.js` file is already included in `.gitignore` so it won't be committed to Git.

### 4. Get a Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the "Maps JavaScript API"
4. Create credentials (API key)
5. Restrict the API key to your domain for security

### 5. Run the Application
```bash
npm start
```

The application will be available at `http://localhost:3000`

### 6. Run Tests
```bash
npm test
```

## Security Best Practices

- ✅ `config.js` is in `.gitignore` (contains actual API key)
- ✅ `config.example.js` is committed (template with placeholder)
- ✅ API key is loaded dynamically from config
- ✅ Instructions provided for setup

## Project Structure

```
├── index.html          # Main HTML file
├── main.js            # JavaScript application logic
├── style.css          # Styling
├── data.json          # Top spots data
├── config.js          # Configuration (not committed)
├── config.example.js  # Configuration template
├── package.json       # Dependencies
└── test/              # Test files
```

## Features

- Interactive Google Maps integration
- Real-time filtering by activity type
- Distance calculation from user location
- Responsive design
