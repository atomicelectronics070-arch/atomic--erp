export function generateDemoHtml(userData: { userName: string, businessName: string, productType: string, colors: string }) {
    const { businessName, productType, colors } = userData;
    const primaryColor = colors.toLowerCase().includes('azul') ? '#2563eb' : colors.toLowerCase().includes('rojo') ? '#dc2626' : '#000000';

    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${businessName} - Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        .cyber-card { 
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
        }
        .cyber-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body class="bg-slate-50 text-slate-900">
    <nav class="p-6 bg-white border-b flex justify-between items-center">
        <h1 class="text-2xl font-black italic uppercase" style="color: ${primaryColor}">${businessName}</h1>
        <div class="flex gap-6 text-xs font-bold uppercase tracking-widest">
            <a href="#" class="hover:text-blue-600">Inicio</a>
            <a href="#" class="hover:text-blue-600">Productos</a>
            <a href="#" class="hover:text-blue-600">Admin</a>
        </div>
    </nav>

    <main class="container mx-auto px-6 py-12">
        <header class="mb-12">
            <h2 class="text-4xl font-black uppercase italic mb-2">Panel de Control</h2>
            <p class="text-slate-500 font-medium">Gestionando: ${productType}</p>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="cyber-card p-8 rounded-2xl">
                <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Ventas Hoy</p>
                <h3 class="text-4xl font-black">$1,240.00</h3>
            </div>
            <div class="cyber-card p-8 rounded-2xl">
                <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Pedidos</p>
                <h3 class="text-4xl font-black">12</h3>
            </div>
            <div class="cyber-card p-8 rounded-2xl">
                <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Visitas</p>
                <h3 class="text-4xl font-black">458</h3>
            </div>
        </div>

        <section class="mt-20">
            <div class="flex justify-between items-end mb-8">
                <h3 class="text-2xl font-black uppercase italic">Inventario Maestro</h3>
                <button class="bg-black text-white px-6 py-3 text-xs font-black uppercase tracking-widest">Nuevo Producto</button>
            </div>
            <div class="bg-white border rounded-2xl overflow-hidden">
                <table class="w-full text-left">
                    <thead class="bg-slate-50 border-b">
                        <tr>
                            <th class="p-6 text-xs font-black uppercase">Producto</th>
                            <th class="p-6 text-xs font-black uppercase">Stock</th>
                            <th class="p-6 text-xs font-black uppercase">Precio</th>
                            <th class="p-6 text-xs font-black uppercase">Estado</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y">
                        <tr>
                            <td class="p-6 font-bold">${productType} - Modelo A</td>
                            <td class="p-6">45 Unidades</td>
                            <td class="p-6">$29.99</td>
                            <td class="p-6"><span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase">Activo</span></td>
                        </tr>
                        <tr>
                            <td class="p-6 font-bold">${productType} - Premium</td>
                            <td class="p-6">12 Unidades</td>
                            <td class="p-6">$89.99</td>
                            <td class="p-6"><span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase">Activo</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </main>

    <footer class="mt-20 p-12 bg-slate-900 text-white text-center">
        <p class="text-xs font-black uppercase tracking-[0.4em] opacity-50">&copy; 2026 ${businessName} - Desarrollado por ATOMIC</p>
    </footer>
</body>
</html>
    `;
}
