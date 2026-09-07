const token = "EAAO2vRww4MoBSVBS263ztXANnlwa3WF8i1A55fj0l6RZCstjmaINjzk9rApxeYanHJcGBYd9VjEhyRtbI9K2BZAG9mGh2XbpIxUM2CaU0CnFUk8BhIAEuU8OzZAas77NzWIkxMd8R7HJMGa3PaJ5npUJjwaJ8ebEi7IScqSQ4PdFcZBgMCQpaI0NFJapZAkLAAwZDZD";

async function inspect() {
    console.log("Inspecting token with Meta /me endpoint...");
    try {
        // 1. Check token info
        const meRes = await fetch(`https://graph.facebook.com/v21.0/me?fields=id,name`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log("Token User/System:", await meRes.json());

        // 2. Check businesses
        const bizRes = await fetch(`https://graph.facebook.com/v21.0/me/businesses`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const bizData = await bizRes.json();
        console.log("Businesses:", JSON.stringify(bizData, null, 2));

        // 3. Check WhatsApp Business Accounts via the business id from user's screenshot: 752087444393239
        const wabaRes = await fetch(`https://graph.facebook.com/v21.0/752087444393239/owned_whatsapp_business_accounts?fields=id,name,phone_numbers{id,display_phone_number,verified_name,quality_rating}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log("WABAs via business 752087444393239:", JSON.stringify(await wabaRes.json(), null, 2));

        // 4. Also check client accounts
        const clientWabaRes = await fetch(`https://graph.facebook.com/v21.0/752087444393239/client_whatsapp_business_accounts?fields=id,name,phone_numbers{id,display_phone_number,verified_name,quality_rating}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log("Client WABAs:", JSON.stringify(await clientWabaRes.json(), null, 2));

    } catch (e) {
        console.error("Error inspecting:", e);
    }
}

inspect();
