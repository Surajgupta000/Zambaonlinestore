import json
import os
import openpyxl

def reclassify():
    base_dir = r"f:\HelpVerse\Zamba-store"
    excel_path = os.path.join(base_dir, "public", "AllinOne", "88d443cb-52ea-4361-8767-4aeee2a18118_attachment_0_highlightedsheetshopdeck54.xlsx")
    json_path = os.path.join(base_dir, "public", "products_classified.json")

    # 1. Load existing classified data to preserve metadata (emoji, rating, reviews, description, badge)
    meta_by_sku = {}
    if os.path.exists(json_path):
        with open(json_path, "r", encoding="utf-8") as f:
            classified_data = json.load(f)
        for cat, prods in classified_data.items():
            for p in prods:
                sku = p.get("sku")
                if sku:
                    meta_by_sku[int(sku)] = {
                        "rating": p.get("rating"),
                        "reviews": p.get("reviews"),
                        "emoji": p.get("emoji"),
                        "badge": p.get("badge"),
                        "description": p.get("description"),
                    }

    # 2. Read products from Excel sheet
    wb = openpyxl.load_workbook(excel_path)
    sheet = wb.active
    rows = list(sheet.iter_rows(values_only=True))

    header = rows[0]
    sku_idx = header.index("Sku Id")
    name_idx = header.index("Name")
    selling_idx = header.index("Selling Price")
    mrp_idx = header.index("MRP")

    # Define classification helper
    def get_category(sku, name):
        name_lower = name.lower()
        
        # Hard overrides for 100% accuracy
        overrides = {
            1013: "couple_toys",  # 7 Inch Strap-on Dildo
            1034: "mens_toys",    # Male Small Penis Cage
            1035: "mens_toys",    # Male Chastity Device
            1054: "couple_toys",  # Mini Stainless Steel Butt Plug
            1065: "womens_toys",  # Nipple Sucker
            1067: "couple_toys",  # Massager for men and women
            1068: "womens_toys",  # Rabbit Vibrator G-spot
            1071: "couple_toys",  # Anal beads
            1072: "couple_toys",  # Vibrator for couple
            1080: "mens_toys",    # Cocking Vibrating Testicle Ring for Male Couple
            1086: "mens_toys",    # Vibrators for Men
        }
        
        if sku in overrides:
            return overrides[sku]
            
        # Couple / Strap-on / Anal / Bondage
        if any(k in name_lower for k in ["couple", "lesbian", "gay", "strap-on", "strap on", "butt plug", "anal", "sensory play", "bonding"]):
            return "couple_toys"
            
        # Men's (avoid matching 'women' since it contains 'men')
        if any(k in name_lower for k in ["sleeve", "condom", "stroker", "masturbator", "pocket pussy", "chastity", "cage", "penis pump", "enlargement pump", "prostate"]):
            return "mens_toys"
        if "for men" in name_lower or "for male" in name_lower or "men reusable" in name_lower:
            return "mens_toys"
            
        # Vibrators (women's vibrators/suckers)
        if any(k in name_lower for k in ["vibrator", "vibrating", "vibrat", "sucker", "rose toy", "sucking rose", "vibrating egg"]):
            return "vibrators"
            
        # Women's
        if any(k in name_lower for k in ["women", "female", "girl", "dildo", "yoni", "nipple", "kegel", "clitoris", "clit", "magic wand", "wand"]):
            return "womens_toys"
            
        return "womens_toys" # Fallback

    new_classified = {
        "mens_toys": [],
        "womens_toys": [],
        "couple_toys": [],
        "vibrators": []
    }

    for r in rows[1:]:
        if len(r) > sku_idx and r[sku_idx] is not None:
            sku = int(r[sku_idx])
            name = str(r[name_idx])
            selling_price = r[selling_idx]
            mrp = r[mrp_idx]
            
            # Calculate discount off percentage
            off = 0
            if mrp and selling_price and mrp > selling_price:
                off = int(round((mrp - selling_price) / mrp * 100))
                
            cat = get_category(sku, name)
            
            # Retrieve meta
            meta = meta_by_sku.get(sku, {})
            
            product_obj = {
                "sku": sku,
                "name": name,
                "price": selling_price,
                "orig": mrp,
                "off": off,
                "rating": meta.get("rating") or 4.5,
                "reviews": meta.get("reviews") or 100,
                "image": f"/AllinOne/Intimate toys sku id wise images/Sku {sku}/1.jpg",
                "emoji": meta.get("emoji") or "🎁",
                "badge": meta.get("badge"),
                "description": meta.get("description") or f"Premium quality intimate toy. SKU: {sku}"
            }
            
            new_classified[cat].append(product_obj)

    # Save to public/products_classified.json
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(new_classified, f, indent=2, ensure_ascii=False)

    print(f"Reclassification complete:")
    for cat, items in new_classified.items():
        print(f" - {cat}: {len(items)} products")

if __name__ == "__main__":
    reclassify()
