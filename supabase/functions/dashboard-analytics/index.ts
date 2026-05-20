import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async () => {
  try {

    // LOCAL SUPABASE CLIENT
 const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

    // =========================
    // TOTAL SALES
    // =========================
    const { data: salesData, error: salesError } = await supabase
      .from("sales")
      .select("*");

    if (salesError) {
      throw salesError;
    }

    const totalSales = (salesData || []).reduce(
      (sum, item) => sum + Number(item.total || 0),
      0
    );

    const totalOrders = salesData?.length || 0;

    // =========================
    // TOP PRODUCTS
    // =========================
    const { data: topProducts, error: productsError } = await supabase
      .from("sales_details")
      .select(`
        quantity,
        products (
          id,
          name
        )
      `);

    if (productsError) {
      throw productsError;
    }

    const productMap: Record<string, number> = {};

    topProducts?.forEach((item: any) => {
      const productName = item.products?.name;

      if (!productName) return;

      if (!productMap[productName]) {
        productMap[productName] = 0;
      }

      productMap[productName] += item.quantity;
    });

    const topProductsArray = Object.entries(productMap)
      .map(([name, quantity]) => ({
        name,
        quantity,
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return new Response(
      JSON.stringify({
        success: true,
        analytics: {
          totalSales,
          totalOrders,
          topProducts: topProductsArray,
        },
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );

  } catch (err: any) {

    return new Response(
      JSON.stringify({
        success: false,
        error: err.message,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );

  }
});