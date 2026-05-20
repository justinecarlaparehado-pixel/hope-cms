CREATE OR REPLACE VIEW product_revenue AS
SELECT
    sd.prodcode,
    SUM(sd.quantity * ph.price) AS total_revenue
FROM salesdetail sd
LEFT JOIN (
    SELECT DISTINCT ON (product_id)
        product_id,
        price
    FROM price_history
    ORDER BY product_id, created_at DESC
) ph
ON sd.prodcode = ph.product_id
GROUP BY sd.prodcode;