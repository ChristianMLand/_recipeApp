from recipe_scrapers import scrape_html
from . import standardize_units
import requests


def parse_recipe(url, user_agent):
    html = requests.get(url, headers={"User-Agent": user_agent}).content
    scraper = scrape_html(html, org_url=url, wild_mode=True)
    return {
        "title": scraper.title(),
        "time": scraper.total_time() if scraper.total_time() <= 1440 else 0,
        "servings": scraper.yields().split(" ")[0],
        "ingredients": list(map(standardize_units, scraper.ingredients())),
        "instructions": scraper.instructions_list(),
        "image": scraper.image(),
    }
