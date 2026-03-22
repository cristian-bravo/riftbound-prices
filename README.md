# Riftbound Prices Scraper

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Puppeteer-40B5A4?style=for-the-badge&logo=puppeteer&logoColor=white" alt="Puppeteer" />
  <img src="https://img.shields.io/badge/License-ISC-blue?style=for-the-badge" alt="License" />
  <img src="https://img.shields.io/github/stars/cristian-bravo/riftbound-prices?style=for-the-badge" alt="Stars" />
  <img src="https://img.shields.io/github/forks/cristian-bravo/riftbound-prices?style=for-the-badge" alt="Forks" />
</div>

<div align="center">
  <h3>🚀 Automate Your Riftbound Card Pricing with Ease</h3>
  <p><em>Scrape, Export, Analyze – All in One Script</em></p>
</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🎥 Demo](#-demo)
- [🛠️ Prerequisites](#️-prerequisites)
- [📦 Installation](#-installation)
- [🚀 Usage](#-usage)
- [📊 Output](#-output)
- [🔧 Dependencies](#-dependencies)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [⚠️ Disclaimer](#️-disclaimer)

---

## ✨ Features

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg" width="50" height="50" alt="Node.js" />
        <br><strong>Node.js Powered</strong>
      </td>
      <td align="center">
        <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/puppeteer.svg" width="50" height="50" alt="Puppeteer" />
        <br><strong>Headless Scraping</strong>
      </td>
      <td align="center">
        <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/microsoft-excel.svg" width="50" height="50" alt="Excel" />
        <br><strong>Excel Ready</strong>
      </td>
    </tr>
  </table>
</div>

- 🔄 **Automated Scraping**: Fetches real-time prices from TCGPlayer
- 📈 **Market Data**: Extracts card names, prices, and timestamps
- 📄 **CSV Export**: Generates Excel-compatible CSV files
- ⚡ **Fast & Efficient**: Headless browser for quick data collection
- 🛡️ **Error Handling**: Robust scraping with timeout management
- 📅 **Timestamped Data**: Tracks when prices were last updated

---

## 🎥 Demo

<div align="center">
  <img src="demo.gif" alt="Riftbound Prices Scraper Demo" width="600" />
  <p><em>Watch the scraper in action – from launch to CSV export!</em></p>
</div>

*(Replace `demo.gif` with your actual demo GIF showing the script running and generating the CSV)*

---

## 🛠️ Prerequisites

- **Node.js** (version 14 or higher) – [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)

---

## 📦 Installation

Get started in just a few steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/cristian-bravo/riftbound-prices.git
   cd riftbound-prices
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Verify installation**:
   ```bash
   node --version
   npm --version
   ```

---

## 🚀 Usage

Running the scraper is as simple as:

```bash
node scraper.js
```

### What happens next?

1. 🚀 Launches a headless Chrome browser
2. 🌐 Navigates to TCGPlayer's Riftbound search page
3. 🔍 Scrapes card data (name, price, timestamp)
4. 💾 Generates `cards.csv` file
5. ✅ Logs completion message

### Advanced Usage

For scheduled runs, you can use cron jobs or task schedulers:

```bash
# Example: Run daily at 9 AM
0 9 * * * /usr/bin/node /path/to/riftbound-prices/scraper.js
```

---

## 📊 Output

The generated `cards.csv` file contains structured data:

| Column    | Description                  | Example                  |
|-----------|------------------------------|--------------------------|
| `name`   | Card name                    | "Spiritforged Guardian Angel" |
| `price`  | Market price (USD)          | 1.82                     |
| `updatedAt` | Local timestamp (`HH:mm:ss DD/MM/YYYY`) | 03:36:43 22/03/2026 |

### Sample Output:
```
name,price,updatedAt
Spiritforged Guardian Angel,1.82,03:36:43 22/03/2026
Origins Hidden Blade,1.34,03:36:43 22/03/2026
```

---

## 🔧 Dependencies

This project relies on:

- **[Puppeteer](https://pptr.dev/)**: For browser automation and web scraping
  - Version: ^24.40.0
  - Handles dynamic content loading and JavaScript execution

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. 🍴 Fork the repository
2. 🌿 Create a feature branch: `git checkout -b feature/amazing-feature`
3. 💻 Make your changes
4. ✅ Commit: `git commit -m 'Add amazing feature'`
5. 📤 Push: `git push origin feature/amazing-feature`
6. 🔄 Open a Pull Request

### Development Setup

```bash
# Install dev dependencies (if any)
npm install

# Run tests (add if you create them)
npm test

# Lint code
npm run lint
```

---

## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

---

## ⚠️ Disclaimer

- This tool is for **personal use only**
- Respect TCGPlayer's [Terms of Service](https://www.tcgplayer.com/terms-of-use/) and [robots.txt](https://www.tcgplayer.com/robots.txt)
- Web scraping may be subject to legal restrictions in your jurisdiction
- Use responsibly and consider rate limiting to avoid overloading servers

---

<div align="center">
  <p>Made with ❤️ for the Riftbound community</p>
  <p>
    <a href="https://github.com/cristian-bravo/riftbound-prices/issues">Report Bug</a> •
    <a href="https://github.com/cristian-bravo/riftbound-prices/issues">Request Feature</a> •
    <a href="https://github.com/cristian-bravo/riftbound-prices">View Source</a>
  </p>
</div>
