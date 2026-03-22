# Riftbound Prices Scraper

A Node.js application that automates the collection of current market prices for Riftbound trading cards from TCGPlayer. The scraped data is exported to a CSV file, making it easy to import into Excel for analysis, inventory management, or pricing strategies.

## Features

- Automated web scraping using Puppeteer
- Extracts card names and market prices
- Exports data to CSV format compatible with Excel
- Includes timestamp for each price update
- Handles dynamic web content loading

## Prerequisites

- Node.js (version 14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/cristian-bravo/riftbound-prices.git
   cd riftbound-prices
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

Run the scraper script:
```bash
node scraper.js
```

The script will:
1. Launch a headless browser
2. Navigate to the TCGPlayer Riftbound search page
3. Scrape card names and prices
4. Generate a `cards.csv` file with the collected data

## Output

The generated `cards.csv` file contains three columns:
- `name`: The card name
- `price`: The current market price (numeric)
- `updatedAt`: ISO timestamp of when the data was scraped

## Dependencies

- [Puppeteer](https://pptr.dev/) - Headless Chrome Node.js API

## License

This project is licensed under the ISC License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Issues

If you encounter any issues or have suggestions, please open an issue on the [GitHub repository](https://github.com/cristian-bravo/riftbound-prices/issues).

## Disclaimer

This tool is for personal use only. Please respect TCGPlayer's terms of service and robots.txt when using web scraping tools.