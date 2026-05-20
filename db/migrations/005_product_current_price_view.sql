CREATE OR REPLACE VIEW product_current_price AS
SELECT
    p.id AS product_id,
    p.name AS product_name,
    ph.price,
    ph.created_at
FROM products p
JOIN price_history ph
ON p.id = ph.product_id
WHERE ph.created_at = (
    SELECT MAX(ph2.created_at)
    FROM price_history ph2
    WHERE ph2.product_id = p.id
);

SELECT * FROM product_current_price;