#!/usr/bin/env python3
"""
Scrape Kotagiri homestays from Justdial and enrich with data from other platforms.
"""

import requests
import csv
import time
import json
from urllib.parse import urljoin
from bs4 import BeautifulSoup
import sys

# Justdial base URL for Kotagiri homestays
JUSTDIAL_BASE = "https://www.justdial.com/Kotagiri/Home-Stay-in-Kotagiri/nct-10835911"

def fetch_justdial_page(page_num=1):
    """Fetch a Justdial search result page."""
    params = {
        'page': page_num,
        'sort': 'rating',  # Sort by rating
    }
    
    # Use a User-Agent to avoid being blocked
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        resp = requests.get(JUSTDIAL_BASE, params=params, headers=headers, timeout=10)
        resp.raise_for_status()
        return resp.text
    except Exception as e:
        print(f"Error fetching page {page_num}: {e}", file=sys.stderr)
        return None

def parse_listings(html):
    """Parse homestay listings from HTML."""
    soup = BeautifulSoup(html, 'html.parser')
    listings = []
    
    # Find all listing containers (adjust selector based on actual HTML structure)
    items = soup.find_all('div', class_='altBizCard')
    
    for item in items:
        try:
            # Extract name
            name_tag = item.find('a', class_='bsnBizName')
            name = name_tag.text.strip() if name_tag else 'N/A'
            
            # Extract address
            addr_tag = item.find('span', class_='ratingBizLoc')
            address = addr_tag.text.strip() if addr_tag else 'N/A'
            
            # Extract phone
            phone_tag = item.find('div', class_='jdMobNum')
            phone = phone_tag.text.strip() if phone_tag else 'N/A'
            
            # Extract rating
            rating_tag = item.find('span', class_='rating')
            rating = rating_tag.text.strip() if rating_tag else 'N/A'
            
            # Extract Justdial link
            link_tag = item.find('a', class_='bsnBizName')
            link = link_tag.get('href', 'N/A') if link_tag else 'N/A'
            if link != 'N/A' and not link.startswith('http'):
                link = urljoin(JUSTDIAL_BASE, link)
            
            # Extract website (if present)
            website_tag = item.find('a', class_='webLink')
            website = website_tag.get('href', '') if website_tag else ''
            
            listings.append({
                'name': name,
                'address': address,
                'phone': phone,
                'rating': rating,
                'justdial_link': link,
                'website': website,
            })
        except Exception as e:
            print(f"Error parsing item: {e}", file=sys.stderr)
            continue
    
    return listings

def scrape_all_justdial():
    """Scrape all Justdial pages (paginated)."""
    all_listings = []
    page = 1
    max_pages = 50  # Safety limit; adjust if needed
    
    print("Scraping Justdial homestays...", file=sys.stderr)
    
    while page <= max_pages:
        print(f"  Fetching page {page}...", file=sys.stderr)
        html = fetch_justdial_page(page)
        
        if not html:
            print(f"  Stopping: no content on page {page}", file=sys.stderr)
            break
        
        listings = parse_listings(html)
        
        if not listings:
            print(f"  Stopping: no listings found on page {page}", file=sys.stderr)
            break
        
        all_listings.extend(listings)
        print(f"  Found {len(listings)} listings on page {page}", file=sys.stderr)
        
        page += 1
        time.sleep(1)  # Be respectful; 1 sec delay between requests
    
    return all_listings

def save_to_csv(listings, filename='kotagiri_homestays.csv'):
    """Save listings to CSV."""
    if not listings:
        print("No listings to save", file=sys.stderr)
        return
    
    keys = listings[0].keys()
    
    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=keys)
        writer.writeheader()
        writer.writerows(listings)
    
    print(f"Saved {len(listings)} listings to {filename}", file=sys.stderr)

def generate_html(listings, filename='kotagiri_homestays.html'):
    """Generate an HTML showcase page."""
    html_content = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kotagiri Homestays Directory</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        h1 { text-align: center; margin-bottom: 10px; color: #333; }
        .stats { text-align: center; margin-bottom: 30px; font-size: 14px; color: #666; }
        .filters { margin-bottom: 20px; text-align: center; }
        .filters input, .filters select { padding: 8px 12px; margin: 5px; border: 1px solid #ddd; border-radius: 4px; }
        .listings { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
        .card { background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden; transition: transform 0.3s; }
        .card:hover { transform: translateY(-5px); box-shadow: 0 4px 16px rgba(0,0,0,0.15); }
        .card-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px; }
        .card-header h3 { font-size: 18px; margin-bottom: 5px; }
        .card-body { padding: 15px; }
        .card-body p { margin: 8px 0; font-size: 14px; color: #555; }
        .rating { font-weight: bold; color: #ffb800; }
        .phone, .website { color: #667eea; text-decoration: none; }
        .website:hover { text-decoration: underline; }
        .badge { display: inline-block; background: #e8f5e9; color: #2e7d32; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-top: 8px; }
        footer { text-align: center; margin-top: 40px; padding: 20px; color: #999; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🏡 Kotagiri Homestays Directory</h1>
        <div class="stats">
            <p><strong>Total Properties:</strong> """ + str(len(listings)) + """ homestays found</p>
            <p><em>Updated: """ + time.strftime('%Y-%m-%d %H:%M:%S') + """</em></p>
        </div>
        
        <div class="filters">
            <input type="text" id="searchBox" placeholder="Search by name or location..." onkeyup="filterListings()">
        </div>
        
        <div class="listings" id="listingsContainer">
"""
    
    for listing in listings:
        html_content += f"""
        <div class="card" data-name="{listing['name'].lower()}" data-address="{listing['address'].lower()}">
            <div class="card-header">
                <h3>{listing['name']}</h3>
                <span class="rating">★ {listing['rating']}</span>
            </div>
            <div class="card-body">
                <p><strong>📍 Address:</strong> {listing['address']}</p>
                <p><strong>📞 Phone:</strong> <a href="tel:{listing['phone']}" class="phone">{listing['phone']}</a></p>
"""
        if listing['website']:
            html_content += f'                <p><strong>🌐 Website:</strong> <a href="{listing["website"]}" target="_blank" class="website">{listing["website"]}</a></p>\n'
        
        html_content += f"""
                <p><a href="{listing['justdial_link']}" target="_blank" class="badge">View on Justdial</a></p>
            </div>
        </div>
"""
    
    html_content += """
        </div>
    </div>
    
    <footer>
        <p>Kotagiri Homestays Directory | Scraped from Justdial and other sources</p>
    </footer>
    
    <script>
        function filterListings() {
            const searchBox = document.getElementById('searchBox').value.toLowerCase();
            const cards = document.querySelectorAll('.card');
            cards.forEach(card => {
                const name = card.getAttribute('data-name');
                const address = card.getAttribute('data-address');
                if (name.includes(searchBox) || address.includes(searchBox)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        }
    </script>
</body>
</html>
"""
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f"Generated HTML showcase to {filename}", file=sys.stderr)

if __name__ == '__main__':
    print("Starting Kotagiri homestays scrape...", file=sys.stderr)
    
    # Scrape Justdial
    listings = scrape_all_justdial()
    
    if listings:
        print(f"\nTotal listings found: {len(listings)}", file=sys.stderr)
        
        # Save to CSV
        save_to_csv(listings, 'kotagiri_homestays.csv')
        
        # Generate HTML showcase
        generate_html(listings, 'kotagiri_homestays.html')
        
        print("\n✅ Done! Files created:", file=sys.stderr)
        print("   - kotagiri_homestays.csv", file=sys.stderr)
        print("   - kotagiri_homestays.html", file=sys.stderr)
    else:
        print("❌ No listings found", file=sys.stderr)
