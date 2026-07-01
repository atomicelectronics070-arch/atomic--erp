const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
    try {
        // 1. Fix Residencial
        const catResProper = await prisma.category.findFirst({ where: { name: 'Residencial', parentId: null } });
        const catResWrong = await prisma.category.findFirst({ where: { name: 'TECNOLOGIA RESIDENCIAL', parentId: null } });
        
        const subResProper = await prisma.category.findMany({ where: { parentId: catResProper.id } });
        const subResWrong = await prisma.category.findMany({ where: { parentId: catResWrong.id } });

        const realAcceso = subResProper.find(s => s.name === 'Control de Acceso');
        const realDomotica = subResProper.find(s => s.name === 'Domótica');
        
        const wrongAcceso = subResWrong.find(s => s.name.includes('Control de Acceso'));
        const wrongDomotica = subResWrong.find(s => s.name.includes('Domótica'));
        const wrongVideo = subResWrong.find(s => s.name.includes('Videoporteros'));
        const wrongCamaras = subResWrong.find(s => s.name.includes('Cámaras'));

        if(wrongAcceso && realAcceso) {
            await prisma.product.updateMany({ where: { categoryId: wrongAcceso.id }, data: { categoryId: realAcceso.id } });
            await prisma.category.delete({ where: { id: wrongAcceso.id } });
        }
        if(wrongDomotica && realDomotica) {
            await prisma.product.updateMany({ where: { categoryId: wrongDomotica.id }, data: { categoryId: realDomotica.id } });
            await prisma.category.delete({ where: { id: wrongDomotica.id } });
        }
        if(wrongVideo) {
            await prisma.category.update({ where: { id: wrongVideo.id }, data: { parentId: catResProper.id } });
        }
        if(wrongCamaras) {
            await prisma.category.update({ where: { id: wrongCamaras.id }, data: { parentId: catResProper.id } });
        }
        console.log('Fixed Residencial structure.');

        // 2. Clean laptops out of Control de Acceso
        const catElec = await prisma.category.findFirst({ where: { name: 'Electrónica', parentId: null } });
        let repuestos = await prisma.category.findFirst({ where: { name: 'Repuestos Laptops', parentId: catElec.id } });
        if(!repuestos) {
            repuestos = await prisma.category.create({ data: { name: 'Repuestos Laptops', slug: 'repuestos-laptops', parentId: catElec.id } });
        }
        const r1 = await prisma.product.updateMany({
            where: { name: { contains: 'teclado', mode: 'insensitive' }, OR: [{ categoryId: realAcceso.id }, { categoryId: null }] },
            data: { categoryId: repuestos.id }
        });
        console.log('Moved', r1.count, 'teclados to Repuestos Laptops');

        // SenseFace
        const r2 = await prisma.product.updateMany({
            where: { name: { contains: 'sense', mode: 'insensitive' } },
            data: { categoryId: realAcceso.id }
        });
        console.log('Moved', r2.count, 'SenseFace to Control de Acceso');

        // 3. Fix Industrial
        const catInd = await prisma.category.findFirst({ where: { name: 'Industrial', parentId: null } });
        const subInd = await prisma.category.findMany({ where: { parentId: catInd.id } });
        const maqConst = subInd.find(s => s.name === 'Maquinaria de Construcción');
        const tratAgua = subInd.find(s => s.name === 'Tratamiento de Agua');
        
        let robotica = subInd.find(s => s.name.includes('Robot'));
        if(!robotica) {
            robotica = await prisma.category.create({ data: { name: 'Robótica', slug: 'robotica', parentId: catInd.id } });
        }

        if(maqConst) {
            const r3 = await prisma.product.updateMany({
                where: { OR: [
                    { name: { contains: 'mezcladora', mode: 'insensitive' } },
                    { name: { contains: 'concretera', mode: 'insensitive' } },
                    { name: { contains: 'compactadora', mode: 'insensitive' } },
                    { name: { contains: 'elevador', mode: 'insensitive' } },
                    { name: { contains: 'vibrador', mode: 'insensitive' } },
                    { name: { contains: 'apisonador', mode: 'insensitive' } },
                    { name: { contains: 'winche', mode: 'insensitive' } }
                ] },
                data: { categoryId: maqConst.id }
            });
            console.log('Moved', r3.count, 'to Maquinaria de Construccion');
        }

        if(tratAgua) {
            const r4 = await prisma.product.updateMany({
                where: { OR: [
                    { name: { contains: 'purificador', mode: 'insensitive' } },
                    { name: { contains: 'osmosis', mode: 'insensitive' } },
                    { name: { contains: 'filtro de agua', mode: 'insensitive' } },
                    { name: { contains: 'membrana', mode: 'insensitive' } }
                ] },
                data: { categoryId: tratAgua.id }
            });
            console.log('Moved', r4.count, 'to Tratamiento de Agua');
        }

        if(robotica) {
            const r5 = await prisma.product.updateMany({
                where: { OR: [
                    { name: { contains: 'robot', mode: 'insensitive' } },
                    { name: { contains: 'brazo robot', mode: 'insensitive' } }
                ] },
                data: { categoryId: robotica.id }
            });
            console.log('Moved', r5.count, 'to Robotica');
        }

        // 4. Fix Software
        const catSoft = await prisma.category.findFirst({ where: { name: 'Software', parentId: null } });
        const subSoft = await prisma.category.findMany({ where: { parentId: catSoft.id } });
        
        // CABLES DE RED -> Redes (Electrónica)
        let redes = await prisma.category.findFirst({ where: { name: 'Redes y Telecomunicaciones', parentId: catElec.id } });
        if(!redes) {
            redes = await prisma.category.create({ data: { name: 'Redes y Telecomunicaciones', slug: 'redes-telecom', parentId: catElec.id } });
        }
        const cablesRed = await prisma.product.findMany({
            where: { name: { contains: 'cable de red', mode: 'insensitive' } }
        });
        await prisma.product.updateMany({
            where: { name: { contains: 'cable de red', mode: 'insensitive' } },
            data: { categoryId: redes.id }
        });
        console.log('Moved', cablesRed.length, 'Cables de Red out of Software');

        const devBots = subSoft.find(s => s.name.includes('Bots'));
        if(devBots) {
            const r6 = await prisma.product.updateMany({
                where: { OR: [
                    { name: { contains: 'bot', mode: 'insensitive' } },
                    { name: { contains: 'licencia', mode: 'insensitive' } },
                    { name: { contains: 'software', mode: 'insensitive' } }
                ] },
                data: { categoryId: devBots.id }
            });
            console.log('Moved', r6.count, 'to Desarrollo de Bots');
        }

        console.log('Done!');
    } catch(e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
run();
