CREATE VIEW customer_sales_summary AS
SELECT
    c.custno,
    c.custname,
    COUNT(s.transno) AS total_orders,
    COUNT(s.transno) AS total_sales
FROM customer c
LEFT JOIN sales s
ON c.custno = s.custno
GROUP BY c.custno, c.custname;