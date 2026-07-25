'use client';
import { motion } from 'framer-motion';

export default function NfcComparisonTable() {
  const features = [
    { name: 'Velocidad de Interacción', nfc: '1 Milisegundo', qr: '10-15 Segundos', papel: 'Manual' },
    { name: 'Durabilidad', nfc: 'De por vida', qr: 'Se raya/desgasta', papel: 'Desechable' },
    { name: 'Actualizable en tiempo real', nfc: '✅ Sí, desde la nube', qr: '❌ No (Hay que reimprimir)', papel: '❌ No' },
    { name: 'Analíticas y Rastreo', nfc: '✅ Dashboard Detallado', qr: '⚠️ Muy Básico', papel: '❌ Nulo' },
    { name: 'Factor "WOW"', nfc: '⭐⭐⭐⭐⭐', qr: '⭐⭐', papel: '⭐' },
    { name: 'Amigable con el Medio Ambiente', nfc: '✅ 100% Ecológico', qr: '⚠️ Depende', papel: '❌ Destructivo' }
  ];

  return (
    <section className="py-24 bg-white px-6 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
          La Diferencia es <span className="text-blue-600">Abismal</span>
        </h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Comparativa técnica entre la tecnología NFC de Atomic frente a los métodos tradicionales que están frenando tu crecimiento.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr>
              <th className="p-6 border-b-2 border-slate-100 text-slate-400 font-medium text-lg w-1/3">Características</th>
              <th className="p-6 border-b-2 border-slate-100 text-center w-1/4">
                <div className="inline-block px-4 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30">NFC Atomic</div>
              </th>
              <th className="p-6 border-b-2 border-slate-100 text-center text-slate-500 font-bold w-1/4">Códigos QR</th>
              <th className="p-6 border-b-2 border-slate-100 text-center text-slate-400 font-bold w-1/4">Papel / Físico</th>
            </tr>
          </thead>
          <tbody>
            {features.map((item, idx) => (
              <motion.tr 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="hover:bg-slate-50 transition-colors group"
              >
                <td className="p-6 border-b border-slate-100 font-bold text-slate-800">{item.name}</td>
                <td className="p-6 border-b border-slate-100 text-center font-black text-blue-600 bg-blue-50/30 group-hover:bg-blue-50/80 transition-colors">{item.nfc}</td>
                <td className="p-6 border-b border-slate-100 text-center text-slate-500">{item.qr}</td>
                <td className="p-6 border-b border-slate-100 text-center text-slate-400">{item.papel}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
