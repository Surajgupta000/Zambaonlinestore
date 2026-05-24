import os
import json
import openpyxl

def generate_db():
    base_dir = r"f:\HelpVerse\Zamba-store"
    excel_path = os.path.join(base_dir, "public", "AllinOne", "88d443cb-52ea-4361-8767-4aeee2a18118_attachment_0_highlightedsheetshopdeck54.xlsx")
    json_path = os.path.join(base_dir, "public", "products_classified.json")
    images_base_dir = os.path.join(base_dir, "public", "AllinOne", "Intimate toys sku id wise images")
    output_path = os.path.join(base_dir, "public", "products_db.json")

    # 1. Load products_classified.json
    with open(json_path, "r", encoding="utf-8") as f:
        classified_data = json.load(f)

    # Gather all classified products by SKU
    classified_by_sku = {}
    for category, products in classified_data.items():
        for prod in products:
            sku = prod.get("sku")
            if sku:
                classified_by_sku[int(sku)] = {
                    "category": category,
                    **prod
                }

    # 2. Load Excel
    wb = openpyxl.load_workbook(excel_path)
    sheet = wb.active
    rows = list(sheet.iter_rows(values_only=True))

    header = rows[0]
    sku_idx = header.index("Sku Id")
    asin_idx = header.index("Amazon ASIN") if "Amazon ASIN" in header else -1
    code_idx = header.index("Product Code") if "Product Code" in header else -1
    mrp_idx = header.index("MRP") if "MRP" in header else -1
    cost_idx = header.index("Cost Price") if "Cost Price" in header else -1
    qty_idx = header.index("Quantity") if "Quantity" in header else -1
    len_idx = header.index("Packaging Length (in cm)") if "Packaging Length (in cm)" in header else -1
    brd_idx = header.index("Packaging Breadth (in cm)") if "Packaging Breadth (in cm)" in header else -1

    excel_by_sku = {}
    for r in rows[1:]:
        if len(r) > sku_idx and r[sku_idx] is not None:
            try:
                sku_val = int(r[sku_idx])
                excel_by_sku[sku_val] = {
                    "asin": r[asin_idx] if asin_idx != -1 and len(r) > asin_idx else None,
                    "product_code": r[code_idx] if code_idx != -1 and len(r) > code_idx else None,
                    "mrp_excel": r[mrp_idx] if mrp_idx != -1 and len(r) > mrp_idx else None,
                    "cost_price": r[cost_idx] if cost_idx != -1 and len(r) > cost_idx else None,
                    "quantity": r[qty_idx] if qty_idx != -1 and len(r) > qty_idx else None,
                    "length_cm": r[len_idx] if len_idx != -1 and len(r) > len_idx else None,
                    "breadth_cm": r[brd_idx] if brd_idx != -1 and len(r) > brd_idx else None,
                }
            except ValueError:
                continue

    # 3. Scan Image Folders
    merged_products = {}
    
    # We want to match all SKUs from either Classified JSON or Excel.
    # Since they are a 1:1 match of 64 products, we will iterate all 64 SKUs.
    all_skus = set(classified_by_sku.keys()).union(excel_by_sku.keys())

    for sku in sorted(all_skus):
        sku_folder_name = f"Sku {sku}"
        sku_folder_path = os.path.join(images_base_dir, sku_folder_name)
        
        images_list = []
        if os.path.exists(sku_folder_path) and os.path.isdir(sku_folder_path):
            # Sort files numerically if possible, e.g. 1.jpg, 2.jpg, etc.
            files = os.listdir(sku_folder_path)
            # Filter only image files
            img_extensions = ('.jpg', '.jpeg', '.png', '.webp', '.gif')
            files = [f for f in files if f.lower().endswith(img_extensions)]
            
            def get_sort_key(filename):
                name, _ = os.path.splitext(filename)
                try:
                    return int(name)
                except ValueError:
                    return filename
            
            files.sort(key=get_sort_key)
            images_list = [f"/AllinOne/Intimate toys sku id wise images/Sku {sku}/{filename}" for filename in files]

        # Combine classified JSON info and Excel sheet details
        class_info = classified_by_sku.get(sku, {})
        excel_info = excel_by_sku.get(sku, {})
        
        merged_products[str(sku)] = {
            "sku": sku,
            "name": class_info.get("name") or excel_info.get("name") or f"Product SKU {sku}",
            "price": class_info.get("price") or class_info.get("Selling Price") or 0,
            "orig": class_info.get("orig") or excel_info.get("mrp_excel") or 0,
            "off": class_info.get("off") or 0,
            "rating": class_info.get("rating") or 4.5,
            "reviews": class_info.get("reviews") or 100,
            "emoji": class_info.get("emoji") or "🎁",
            "badge": class_info.get("badge"),
            "description": class_info.get("description") or f"Premium quality intimate toy. SKU: {sku}",
            "category": class_info.get("category") or "intimate_toys",
            "images": images_list,
            # Excel columns
            "asin": excel_info.get("asin"),
            "product_code": excel_info.get("product_code"),
            "cost_price": excel_info.get("cost_price"),
            "quantity": excel_info.get("quantity"),
            "length_cm": excel_info.get("length_cm"),
            "breadth_cm": excel_info.get("breadth_cm"),
        }

    # Write output to public/products_db.json
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(merged_products, f, indent=2, ensure_ascii=False)

    print(f"Successfully generated database with {len(merged_products)} products.")

if __name__ == "__main__":
    generate_db()
