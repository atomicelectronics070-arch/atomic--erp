import sys

with open('src/app/dashboard/shop/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add import SupplierManager
if 'SupplierManager' not in content:
    content = content.replace('import { CyberCard, NeonButton, CyberInput, GlassPanel } from "@/components/ui/CyberUI"', 'import { CyberCard, NeonButton, CyberInput, GlassPanel } from "@/components/ui/CyberUI"\nimport { SupplierManager } from "@/components/shop/SupplierManager"')

# 2. Add providers to state
if 'providersList: string[]' not in content:
    content = content.replace('const [metadata, setMetadata] = useState<{ categories: any[], collections: any[] }>({ categories: [], collections: [] })', 'const [metadata, setMetadata] = useState<{ categories: any[], collections: any[], providersList: string[] }>({ categories: [], collections: [], providersList: [] })')
    content = content.replace('setMetadata({ categories: data.categories, collections: data.collections })', 'setMetadata({ categories: data.categories, collections: data.collections, providersList: data.providersList || [] })')

# 3. Add to tabs
content = content.replace("useState<'products' | 'catalogs' | 'settings'>('products')", "useState<'products' | 'catalogs' | 'settings' | 'suppliers' | 'prices_list'>('products')")
content = content.replace("{['products', 'catalogs', 'settings'].map((tab) => (", "{['products', 'suppliers', 'prices_list', 'catalogs', 'settings'].map((tab) => (")

# 4. Add content block for suppliers
if '<SupplierManager' not in content:
    supplier_block = '''
                {activeTab === 'suppliers' && (
                    <SupplierManager 
                        providers={metadata.providersList || []}
                        settings={storeSettings}
                        onUpdateSettings={setStoreSettings}
                        onFilterProvider={(provider) => {
                            setDashboardSearch(provider)
                            setActiveTab('products')
                        }}
                    />
                )}
                
                {activeTab === 'prices_list' && (
                    <div className="w-full h-[calc(100vh-10rem)] bg-[#0c0c14] rounded-2xl overflow-hidden border border-slate-200/50 shadow-2xl relative">
                        <iframe 
                            src="/prices/index.html" 
                            className="w-full h-full border-none"
                            title="Lista de Precios"
                        />
                    </div>
                )}
'''
    content = content.replace("{activeTab === 'products' && (", supplier_block + "\n                {activeTab === 'products' && (")

# 5. Add translations for tabs
content = content.replace("{tab.charAt(0).toUpperCase() + tab.slice(1)}", "{tab === 'products' ? 'Inventario' : tab === 'suppliers' ? 'Proveedores' : tab === 'prices_list' ? 'Lista Precios' : tab === 'catalogs' ? 'Catálogos' : 'Configuración'}")

with open('src/app/dashboard/shop/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated shop/page.tsx')
