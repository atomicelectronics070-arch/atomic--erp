export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiKey = body.apiKey || process.env.BINANCE_API_KEY;
    const apiSecret = body.apiSecret || process.env.BINANCE_API_SECRET;
    const action = body.action || "test";

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Falta API Key o Secret Key de Binance.",
          hint: "Obtén tus claves en Binance > Perfil > Gestión de API."
        }, 
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const recvWindow = 60000;

    if (action === "test" || action === "account") {
      const queryString = `recvWindow=${recvWindow}&timestamp=${timestamp}`;
      const signature = crypto
        .createHmac("sha256", apiSecret.trim())
        .update(queryString)
        .digest("hex");

      const response = await fetch(
        `https://api.binance.com/api/v3/account?${queryString}&signature=${signature}`,
        {
          headers: {
            "X-MBX-APIKEY": apiKey.trim(),
            "Content-Type": "application/json"
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json({
          success: false,
          error: data.msg || "Error de autenticación con Binance.",
          code: data.code,
          details: "Verifica que la API Key no esté vencida y tenga permisos de Lectura."
        }, { status: response.status });
      }

      // Filter balances with positive funds
      const activeBalances = (data.balances || [])
        .filter((b: any) => parseFloat(b.free) > 0 || parseFloat(b.locked) > 0)
        .map((b: any) => ({
          asset: b.asset,
          free: parseFloat(b.free),
          locked: parseFloat(b.locked),
          total: parseFloat(b.free) + parseFloat(b.locked)
        }));

      return NextResponse.json({
        success: true,
        status: "CONNECTED",
        canTrade: data.canTrade,
        accountType: data.accountType,
        updateTime: data.updateTime,
        balances: activeBalances,
        totalAssetsTracked: activeBalances.length
      });
    }

    if (action === "order") {
      const { symbol, side, type = "MARKET", quantity, price } = body;
      if (!symbol || !side) {
        return NextResponse.json({ success: false, error: "Par de trading y lado de orden requeridos." }, { status: 400 });
      }

      let params = `symbol=${symbol.toUpperCase()}&side=${side.toUpperCase()}&type=${type.toUpperCase()}&timestamp=${timestamp}&recvWindow=${recvWindow}`;
      if (quantity) params += `&quantity=${quantity}`;
      if (type.toUpperCase() === "LIMIT" && price) params += `&price=${price}&timeInForce=GTC`;

      const signature = crypto
        .createHmac("sha256", apiSecret.trim())
        .update(params)
        .digest("hex");

      // Test order dry-run
      const orderEndpoint = body.testOnly !== false ? "/api/v3/order/test" : "/api/v3/order";
      const response = await fetch(`https://api.binance.com${orderEndpoint}?${params}&signature=${signature}`, {
        method: "POST",
        headers: {
          "X-MBX-APIKEY": apiKey.trim(),
          "Content-Type": "application/json"
        }
      });

      const orderData = await response.json();
      if (!response.ok) {
        return NextResponse.json({
          success: false,
          error: orderData.msg || "Error al emitir orden en Binance.",
          code: orderData.code
        }, { status: response.status });
      }

      return NextResponse.json({
        success: true,
        mode: body.testOnly !== false ? "TEST_VALIDATED" : "EXECUTED",
        symbol,
        side,
        type,
        data: orderData
      });
    }

    return NextResponse.json({ success: false, error: "Acción no reconocida." }, { status: 400 });
  } catch (error: any) {
    console.error("Error en Binance API Gateway:", error);
    return NextResponse.json({ success: false, error: error.message || "Error interno del servidor." }, { status: 500 });
  }
}
