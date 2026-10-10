from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import SessionLocal
from ..models import Product, Transaction, Customer


router = APIRouter(
    prefix="/ai",
    tags=["AI Assistant"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/ask")
def ask_ai(
    vendor_id: int,
    question: str,
    db: Session = Depends(get_db)
):

    # --------------------------------
    # GET VENDOR DATA
    # --------------------------------

    products = db.query(Product).filter(
        Product.vendor_id == vendor_id
    ).all()

    transactions = db.query(Transaction).filter(
        Transaction.vendor_id == vendor_id
    ).all()

    customer_ids = set(
        transaction.customer_id
        for transaction in transactions
    )

    # --------------------------------
    # BASIC BUSINESS INFORMATION
    # --------------------------------

    total_products = len(products)

    low_stock_products = [
        product for product in products
        if product.quantity <= 5
    ]

    total_sales = sum(
        transaction.quantity
        for transaction in transactions
    )

    total_revenue = sum(
        transaction.total_amount
        for transaction in transactions
    )

    total_customers = len(customer_ids)

    # --------------------------------
    # FIND TOP SELLING PRODUCTS
    # --------------------------------

    product_sales = {}

    for transaction in transactions:

        product_sales[transaction.product_id] = (
            product_sales.get(
                transaction.product_id,
                0
            )
            + transaction.quantity
        )

    top_products = []

    for product_id, quantity in product_sales.items():

        product = db.query(Product).filter(
            Product.product_id == product_id
        ).first()

        if product:

            top_products.append({
                "name": product.product_name,
                "quantity": quantity
            })

    top_products.sort(
        key=lambda x: x["quantity"],
        reverse=True
    )

    # --------------------------------
    # UNDERSTAND QUESTION
    # --------------------------------

    q = question.lower()

    # --------------------------------
    # LOW STOCK
    # --------------------------------

    if (
        "stock" in q
        or "restock" in q
        or "inventory" in q
    ):

        if low_stock_products:

            names = ", ".join(
                product.product_name
                for product in low_stock_products[:5]
            )

            answer = (
                f"You currently have "
                f"{len(low_stock_products)} low-stock products. "
                f"Consider restocking: {names}."
            )

        else:

            answer = (
                "Your inventory currently looks healthy. "
                "There are no products below the low-stock threshold."
            )

    # --------------------------------
    # TOP PRODUCTS
    # --------------------------------

    elif (
        "best selling" in q
        or "top product" in q
        or "selling well" in q
        or "selling" in q
    ):

        if top_products:

            result = ", ".join(
                f"{item['name']} ({item['quantity']} units)"
                for item in top_products[:5]
            )

            answer = (
                f"Your top-selling products are: {result}."
            )

        else:

            answer = (
                "There is not enough transaction data "
                "to identify top-selling products yet."
            )

    # --------------------------------
    # REVENUE
    # --------------------------------

    elif (
        "revenue" in q
        or "sales" in q
        or "earning" in q
        or "income" in q
    ):

        answer = (
            f"Your current total revenue is ₹{total_revenue}. "
            f"You have recorded {total_sales} units sold "
            f"across {len(transactions)} transactions."
        )

    # --------------------------------
    # CUSTOMERS
    # --------------------------------

    elif (
        "customer" in q
        or "customers" in q
        or "buyer" in q
    ):

        answer = (
            f"You currently have {total_customers} unique customers "
            f"based on your transaction history."
        )

    # --------------------------------
    # RECOMMENDATIONS
    # --------------------------------

    elif (
        "recommend" in q
        or "suggest" in q
        or "advice" in q
        or "what should i do" in q
    ):

        recommendations = []

        if low_stock_products:

            recommendations.append(
                f"restock {low_stock_products[0].product_name}"
            )

        if top_products:

            recommendations.append(
                f"promote {top_products[0]['name']}"
            )

        if recommendations:

            answer = (
                "Based on your current business data, "
                "I recommend that you "
                + " and ".join(recommendations)
                + "."
            )

        else:

            answer = (
                "Add more transaction data so I can "
                "provide stronger business recommendations."
            )

    # --------------------------------
    # GENERAL QUESTION
    # --------------------------------

    else:

        answer = (
            f"Here's a quick overview of your store: "
            f"{total_products} products, "
            f"{total_customers} customers, "
            f"{total_sales} units sold, "
            f"and ₹{total_revenue} total revenue. "
            f"You can ask me about sales, customers, "
            f"top-selling products, inventory, or recommendations."
        )

    # --------------------------------
    # RESPONSE
    # --------------------------------

    return {
        "question": question,
        "answer": answer,
        "data": {
            "total_products": total_products,
            "low_stock_products": len(low_stock_products),
            "total_sales": total_sales,
            "total_revenue": total_revenue,
            "total_customers": total_customers
        }
    }