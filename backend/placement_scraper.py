# placement_scraper.py
import asyncio
from datetime import datetime
from playwright.async_api import async_playwright

URL = "https://www.placement.nitc.ac.in/"

async def scrape():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto(URL, wait_until="networkidle")

        cards = await page.query_selector_all(".card")
        data = []

        for card in cards:
            company = await card.query_selector_eval(".card-title", "el => el.innerText") if await card.query_selector(".card-title") else ""
            details = await card.query_selector_all(".card-text")
            
            role, date, pkg = "", "", ""
            for d in details:
                text = await d.evaluate("(el) => el.innerText")
                if "Role" in text:
                    role = text.split(":", 1)[-1].strip()
                elif "Date" in text or "Drive" in text:
                    date = text.split(":", 1)[-1].strip()
                elif "Package" in text:
                    pkg = text.split(":", 1)[-1].strip()

            if company:
                data.append({
                    "company_name": company,
                    "role": role,
                    "drive_date": date,
                    "package_info": pkg,
                    "source_url": URL,
                    "last_scraped_at": datetime.utcnow()
                })

        await browser.close()
        return data
