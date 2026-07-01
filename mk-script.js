// ==========================================
// 1. BASE DE DATOS (TU INVENTARIO REAL)
// ==========================================
const listaProductos = [
  {
    "id": "P0001",
    "name": "Arduino UNO ",
    "sku": "ARD-UNO-R3",
    "category": "Microcontroladores",
    "price": 24.5,
    "stock": 35,
    "image": "img/arduino-uno.jpg",
    "description": "Tarjeta programadora para varios proyectos.",
    "active": true
  },
  {
    "id": "P0002",
    "name": "Arduino NANO",
    "sku": "ARD-NAN-1",
    "category": "Microcontroladores",
    "price": 10.0,
    "stock": 20,
    "image": "img/arduino-nano.jpg",
    "description": "Tarjeta programadora para varios proyectos.",
    "active": true
  },
  {
    "id": "P0003",
    "name": "ESP32",
    "sku": "ESP-32-IOT",
    "category": "Microcontroladores",
    "price": 12.0,
    "stock": 20,
    "image": "img/esp32.jpg",
    "description": "Tarjeta programadora para varios proyectos.",
    "active": true
  },
  {
    "id": "P0004",
    "name": "PIC 16F877A",
    "sku": "PIC-16F-877A",
    "category": "Microcontroladores",
    "price": 15,
    "stock": 1,
    "image": "img/PIC16f877A.jpg",
    "description": "Tarjeta programadora para varios proyectos.",
    "active": true
  },
  {
    "id": "P0005",
    "name": "Modulo de Radio Frecuencia 433MHz",
    "sku": "MOD-RF-433MHZ",
    "category": "Modulo y conexión",
    "price": 4.5,
    "stock": 20,
    "image": "img/modulo-rf.jpg",
    "description": "Modulo para transmitir datos en antena",
    "active": true
  },
  {
    "id": "P0006",
    "name": "Modulo Bluetooth HC-06",
    "sku": "BT-HC-06",
    "category": "Moudulo y conexión",
    "price": 8.0,
    "stock": 20,
    "image": "img/modulo-hc.jpg",
    "description": "Modulo para transmitir datos en BT",
    "active": true
  },
  {
    "id": "P0007",
    "name": "Modulo Receptor Infrarrojo 38 KHz",
    "sku": "MOD-INFR-38",
    "category": "Modulo y conexión",
    "price": 5,
    "stock": 3,
    "image": "img/modulo-infrarrojo.jpg",
    "description": "Modulo para recibir datos",
    "active": true
  },
  {
    "id": "P0008",
    "name": "Modulo Rele 1 canal",
    "sku": "MOD-01-CH",
    "category": "Modulo de conexión a altos voltajes",
    "price": 4.5,
    "stock": 10,
    "image": "img/modulo_rele1.jpg",
    "description": "Modulo para proyectos con voltajes de 120v",
    "active": true
  },
  {
    "id": "P0009",
    "name": "Modulo Rele 2 canales",
    "sku": "MOD-02-CH",
    "category": "Modulo de conexión a altos voltajes",
    "price": 7.0,
    "stock": 10,
    "image": "img/mod_rele2.jpg",
    "description": "Modulo para proyectos con voltajes de 120v",
    "active": true
  },
  {
    "id": "P0010",
    "name": "Modulo Rele 4 canales",
    "sku": "MOD-04-CH",
    "category": "Modulo de conexión a altos voltajes",
    "price": 10,
    "stock": 5,
    "image": "img/mod_rele4.jpg",
    "description": "Modulo para proyectos con voltajes de 120v",
    "active": true
  },
  {
    "id": "P0011",
    "name": "Shield CNC",
    "sku": "SHD-CNC-01",
    "category": "Modulo para impresoras 3d y CNC",
    "price": 7.0,
    "stock": 2,
    "image": "img/shield.jpg",
    "description": "Modulo para mover varios motores de un CNC o impresora 3d",
    "active": true
  },
  {
    "id": "P0012",
    "name": "Modulo Joystick",
    "sku": "SEN-JOY-01",
    "category": "Modulo para proyectos",
    "price": 4,
    "stock": 15,
    "image": "img/mod-joy.jpg",
    "description": "Modulo para accionar varias elementos",
    "active": true
  },
  {
    "id": "P0013",
    "name": "Sensor de detector de llama",
    "sku": "SEN-FIR-01",
    "category": "Sensores",
    "price": 3,
    "stock": 3,
    "image": "img/mod-ll.jpg",
    "description": "Sensor que detecta la prescencia de fuego.",
    "active": true
  },
  {
    "id": "P0014",
    "name": "Modulo RGB",
    "sku": "MOD-RGB-01",
    "category": "Modulo de brillo",
    "price": 2,
    "stock": 3,
    "image": "img/mod-rgb.jpg",
    "description": "Modulo para tener cualquier color.",
    "active": true
  },
  {
    "id": "P0015",
    "name": "Modulo HeartBeat",
    "sku": "MOD-COR-01",
    "category": "Modulo de frecuencia cardiaca ",
    "price": 3,
    "stock": 3,
    "image": "img/mod-heart.jpg",
    "description": "Modulo que mide la frecuencia cardiaca.",
    "active": true
  },
  {
    "id": "P0016",
    "name": "Sensor Light cup",
    "sku": "SEN-LCP-01",
    "category": "Sensores",
    "price": 3,
    "stock": 3,
    "image": "img/mod-tm.jpg",
    "description": "Sensor que detecta las vibraciones y las inclinacion de una superficie.",
    "active": true
  },
  {
    "id": "P0017",
    "name": "Sensor KY 020",
    "sku": "SEN-KY0-01",
    "category": "Sensores",
    "price": 3,
    "stock": 3,
    "image": "img/mod-ky.jpg",
    "description": "Sensor que detecta las inclinaciones.",
    "active": true
  },
  {
    "id": "P0018",
    "name": "Sensor de temperatura DHT-11",
    "sku": "SEN-TEM-01",
    "category": "Sensores",
    "price": 3.25,
    "stock": 3,
    "image": "img/sensor_temo.jpg",
    "description": "Sensores que mide la temperatura y la humedad en un ambiente.",
    "active": true
  },
  {
    "id": "P0019",
    "name": "Sensor de PIR ",
    "sku": "SEN-PIR-01",
    "category": "Sensores",
    "price": 4.75,
    "stock": 3,
    "image": "img/sen_pir.png",
    "description": "Sensor que detecta la distancia a corto y mediano alcance ",
    "active": true
  },
  {
    "id": "P0020",
    "name": "Sensor Hall",
    "sku": "SEN-HAL-01",
    "category": "Sensores",
    "price": 2.5,
    "stock": 3,
    "image": "img/sen_hall.jfif",
    "description": "Sensores que mide el campo magentico de un cable",
    "active": true
  },
  {
    "id": "P0021",
    "name": "Modulo Buzzer",
    "sku": "MOD-BZZ-01",
    "category": "Modulo acustico",
    "price": 2.5,
    "stock": 3,
    "image": "img/mod_bzz.jfif",
    "description": "Modulo que sirve para generar sonido y pausarlo.",
    "active": true
  },
  {
    "id": "P0022",
    "name": "Modulo sensor de objetos HC-SR04",
    "sku": "MOD-HC-01",
    "category": "Modulo de detección",
    "price": 3.2,
    "stock": 40,
    "image": "img/mod-hsr.jfif",
    "description": "Modulo que detecta movimiento de objetos",
    "active": true
  },
  {
    "id": "P0023",
    "name": "Resistencias de 1/4 w",
    "sku": "RES-VM-01",
    "category": "Resistencias para electronica",
    "price": 0.05,
    "stock": 1000,
    "image": "img/resistencia.jpg",
    "description": "Elemento es un elemento pasivo opone el flujo de corriente.",
    "active": true
  },
  {
    "id": "P0024",
    "name": "Leds 3 MM",
    "sku": "LED-3M-01",
    "category": "Leds",
    "price": 0.15,
    "stock": 1000,
    "image": "img/leds_3mm.jpg",
    "description": "Elemento activo que genera brillo.",
    "active": true
  },
  {
    "id": "P0025",
    "name": "Led 5 MM",
    "sku": "LED-5M-01",
    "category": "Leds",
    "price": 0.15,
    "stock": 1000,
    "image": "img/leds_5mm.jpeg",
    "description": "Elemento activo que genera brillo.",
    "active": true
  },
  {
    "id": "P0026",
    "name": "Diodo rectificador 1n4004",
    "sku": "DIO-1N-04",
    "category": "Semiconductores",
    "price": 0.20,
    "stock": 1000,
    "image": "img/diodo-1n04.jpg",
    "description": "Elemento activo que pasa en un solo sentido la corriente.",
    "active": true
  },
  {
    "id": "P0027",
    "name": "Diodo zener 3v",
    "sku": "DIO-ZN-3V",
    "category": "Semiconductores",
    "price": 0.50,
    "stock": 10,
    "image": "img/z3v.jpg",
    "description": "Limita voltaje.",
    "active": true
  },
  {
    "id": "P0028",
    "name": "Diodo zener 5v",
    "sku": "DIO-ZN-5V",
    "category": "Semiconductores",
    "price": 0.50,
    "stock": 10,
    "image": "img/z3v.jpg",
    "description": "Limita voltaje.",
    "active": true
  },
  {
    "id": "P0029",
    "name": "Diodo zener 7v",
    "sku": "DIO-ZN-7V",
    "category": "Semiconductores",
    "price": 0.50,
    "stock": 10,
    "image": "img/z3v.jpg",
    "description": "Limita voltaje.",
    "active": true
  },
  {
    "id": "P0030",
    "name": "Diodo zener 9v",
    "sku": "DIO-ZN-9V",
    "category": "Semiconductores",
    "price": 0.50,
    "stock": 10,
    "image": "img/z3v.jpg",
    "description": "Limita voltaje.",
    "active": true
  },
  {
    "id": "P0031",
    "name": "LCD 16X2",
    "sku": "LCD-16-02",
    "category": "LCD",
    "price": 10,
    "stock": 2,
    "image": "img/lcd16x2.jpg",
    "description": "Pantalla de cristal liquido para visiualizar.",
    "active": true
  },
  {
    "id": "P0032",
    "name": "LCD 128x64",
    "sku": "LCD-12-64",
    "category": "LCD",
    "price": 18,
    "stock": 1,
    "image": "img/lcd64.jpg",
    "description": "Pantalla de cristal liquido para visiualizar.",
    "active": true
  },
  {
    "id": "P0033",
    "name": "Led tipo emisor",
    "sku": "LED-TP-E0",
    "category": "Leds",
    "price": 0.50,
    "stock": 50,
    "image": "img/led_em.jfif",
    "description": "Componente que recibe señal .",
    "active": true
  },
  {
    "id": "P0034",
    "name": "Led tipo receptor",
    "sku": "LED-TP-R0",
    "category": "Leds",
    "price": 0.50,
    "stock": 50,
    "image": "img/led_rec.jpg",
    "description": "Componente que genera señal.",
    "active": true
  },
  {
    "id": "P0035",
    "name": "Display de 7 segmentos anodo comun",
    "sku": "DIS-7S-AC",
    "category": "Leds",
    "price": 0.80,
    "stock": 50,
    "image": "img/display_ac.jfif",
    "description": "Leds para visualizar numeros y letras.",
    "active": true
  },
  {
    "id": "P0036",
    "name": "Display de 7 segmentos catodo comun",
    "sku": "DIS-7S-CC",
    "category": "Leds",
    "price": 0.80,
    "stock": 50,
    "image": "img/display_ac.jfif",
    "description": "Leds para visualizar numeros y letras.",
    "active": true
  },
  {
    "id": "P0037",
    "name": "Decodificador de 7 segmentos  7447",
    "sku": "DEC-7S-AC",
    "category": "Decodificador",
    "price": 0.80,
    "stock": 20,
    "image": "img/7447.jfif",
    "description": "Comunicacion de CI para el display.",
    "active": true
  },
  {
    "id": "P0038",
    "name": "Decodificador de 7 segmentos  7448",
    "sku": "DEC-7S-CC",
    "category": "Decodificador",
    "price": 0.80,
    "stock": 20,
    "image": "img/7448.jfif",
    "description": "Comunicacion de CI para el display.",
    "active": true
  },
  {
    "id": "P0039",
    "name": "Servomotor 90 grados de libertad SG90",
    "sku": "SVM-SG-90",
    "category": "Motores",
    "price": 3.0,
    "stock": 50,
    "image": "img/SG90.jpg",
    "description": "Motor electrico que permite controlarlo con microcontrolador.",
    "active": true
  },
  {
    "id": "P0040",
    "name": "Servomotor 180 grados de libertad SG180",
    "sku": "SVM-SG-180",
    "category": "Motores",
    "price": 3.0,
    "stock": 50,
    "image": "img/sg180.jpg",
    "description": "Motor electrico que permite controlarlo con microcontrolador.",
    "active": true
  },
  {
    "id": "P0041",
    "name": "Motorreductor amarillo",
    "sku": "MTR-AM-01",
    "category": "Motor",
    "price": 1.8,
    "stock": 50,
    "image": "img/mama.jpg",
    "description": "Motor amarillo para proyectos electronicos.",
    "active": true
  },
  {
    "id": "P0042",
    "name": "Rueda de llanta 66mm",
    "sku": "RUD-LL-6M",
    "category": "Ruedas",
    "price": 1.5,
    "stock": 50,
    "image": "img/rueda_ama.jpg",
    "description": "Rueda para pequeños y medianos proyectos .",
    "active": true
  },
  {
    "id": "P0043",
    "name": "Micro motorreductor ",
    "sku": "UMR-01-01",
    "category": "Motor",
    "price": 1.7,
    "stock": 50,
    "image": "img/micro_mot.jpg",
    "description": "Motor para competencias de velocidad y robot de batalla .",
    "active": true
  },
  {
    "id": "P0044",
    "name": "Mini bomba de agua 12v",
    "sku": "BOM-AG-01",
    "category": "Bombas",
    "price": 15,
    "stock": 20,
    "image": "img/bombas_agua.jpg",
    "description": "Elemento activo para mover el agua.",
    "active": true
  },
  {
    "id": "P0045",
    "name": "Ventiladores de 12v",
    "sku": "VEN-12-01",
    "category": "Ventiladores",
    "price": 8.9,
    "stock": 58,
    "image": "img/vent_12v.jpg",
    "description": "Elemento que genera aire para enfriacion de equipos.",
    "active": true
  },
  {
    "id": "P0046",
    "name": "Cable conversor convertidor USB RS232 Serial",
    "sku": "SER-USB-01",
    "category": "Comunicacion",
    "price": 8,
    "stock": 2,
    "image": "img/cable_serial.jpg",
    "description": "Comunicacion para puertos serial a usb ",
    "active": true
  },
  {
    "id": "P0047",
    "name": "Adaptador DB9 macho",
    "sku": "ADP-D9-01",
    "category": "Comunicacion",
    "price": 1.5,
    "stock": 20,
    "image": "img/adapatador_db9.jfif",
    "description": "Comunicacion para sistemas antiguas.",
    "active": true
  },
  {
    "id": "P0048",
    "name": "Pinza para cortar cable",
    "sku": "PIZ-CC-01",
    "category": "Herramientas",
    "price": 2.0,
    "stock": 20,
    "image": "img/pinza_cc.jpg",
    "description": "Herramienta para cortar cables delgados.",
    "active": true
  },
  {
    "id": "P0049",
    "name": "Cautin de madera",
    "sku": "CAN-MR-01",
    "category": "Herramientas",
    "price": 3.5,
    "stock": 5,
    "image": "img/cautin_mad.jpg",
    "description": "Herramienta para soldar/desoldar equipos electronicos.",
    "active": true
  },
  {
    "id": "P0050",
    "name": "Cautin indicador de luz",
    "sku": "CAN-LZ-01",
    "category": "Herramientas",
    "price": 5.0,
    "stock": 5,
    "image": "img/cautin_luz.png",
    "description": "Herramienta para soldar/desoldar equipos electronicos.",
    "active": true
  },
  {
    "id": "P0051",
    "name": "Estaño para soldar mediano",
    "sku": "SOL-SN-01",
    "category": "Herramientas",
    "price": 5.0,
    "stock": 10,
    "image": "img/estaño.jfif",
    "description": "Elemento para pegar elementos electronicos en una placa.",
    "active": true
  },
  {
    "id": "P0052",
    "name": "Estaño para soldar grande",
    "sku": "SOL-SN-02",
    "category": "Herramientas",
    "price": 20.0,
    "stock": 5,
    "image": "img/estaño.jfif",
    "description": "Elemento para pegar elementos electronicos en una placa.",
    "active": true
  },
  {
    "id": "P0053",
    "name": "Pomada pequeña",
    "sku": "POM-PQ-01",
    "category": "Herramientas",
    "price": 1.0,
    "stock": 20,
    "image": "img/pomada.jpg",
    "description": "Herramienta para que tenga adherencia con el estaño.",
    "active": true
  },
  {
    "id": "P0054",
    "name": "Pomada grande",
    "sku": "POM-GD-01",
    "category": "Herramientas",
    "price": 5.0,
    "stock": 5,
    "image": "img/pomada.jpg",
    "description": "Herramienta para que tenga adherencia con el estaño.",
    "active": true
  },
  {
    "id": "P0055",
    "name": "Multimetro pequeño",
    "sku": "MUL-PQ-01",
    "category": "Herramientas",
    "price": 10,
    "stock": 2,
    "image": "img/multim_eño.jpg",
    "description": "Herramienta para medir valores electricos/electronicos.",
    "active": true
  },
  {
    "id": "P0056",
    "name": "Multimetro mediano",
    "sku": "MUL-ME-01",
    "category": "Herramientas",
    "price": 15.0,
    "stock": 2,
    "image": "img/multim_med.jpg",
    "description": "Herramienta para medir valores electricos/electronicos.",
    "active": true
  },
  {
    "id": "P0057",
    "name": "Multimetro grande",
    "sku": "MUL-GD-01",
    "category": "Multimetro",
    "price": 20.0,
    "stock": 2,
    "image": "img/multim_gran.jpg",
    "description": "Herramienta para medir valores electricos/electronicos.",
    "active": true
  },
  {
    "id": "P0058",
    "name": "Pila de 9V",
    "sku": "PIL-9V-01",
    "category": "Alimentacion",
    "price": 2.0,
    "stock": 10,
    "image": "img/pila_9v.jfif",
    "description": "Alimentacion para circuitos o proyectos electronicos",
    "active": true
  },
  {
    "id": "P0059",
    "name": "Pila CR2032",
    "sku": "PIL-CR-01",
    "category": "Alimentacion",
    "price": 1.5,
    "stock": 20,
    "image": "img/pila_cr.jpg",
    "description": "Alimentacion para circuitos o proyectos electronicos",
    "active": true
  },
  {
    "id": "P0060",
    "name": "Adaptador de 9v",
    "sku": "ADP-9V-01",
    "category": "Alimentacion",
    "price": 5.0,
    "stock": 2,
    "image": "img/adap_9v.jfif",
    "description": "Alimentacion para circuitos o proyectos electronicos",
    "active": true
  },
  {
    "id": "P0061",
    "name": "Adaptador de 12v variable",
    "sku": "ADP-12V-01",
    "category": "Alimentacion",
    "price": 8.0,
    "stock": 5,
    "image": "img/adap_var.jfif",
    "description": "Alimentacion para circuitos o proyectos electronicos",
    "active": true
  },
  {
    "id": "P0062",
    "name": "Voltimetro digital pequeño",
    "sku": "VOL-DI-01",
    "category": "Herramientas",
    "price": 2.50,
    "stock": 20,
    "image": "img/voltim.jpg",
    "description": "Herramienta para medir valores electricos/electronicos.",
    "active": true
  },
  {
    "id": "P0063",
    "name": "Regulador STEP-DOWN LM-2596",
    "sku": "REG-LM-01",
    "category": "Alimentacion",
    "price": 3.0,
    "stock": 10,
    "image": "img/conversor_redu.jpg",
    "description": "Herramienta para aumentar/disminuir voltajes.",
    "active": true
  },
  {
    "id": "P0064",
    "name": "Pulsador 2 Pines",
    "sku": "PUL-2P-01",
    "category": "Accionamiento",
    "price": 0.12,
    "stock": 100,
    "image": "img/pulsador_2p.jpg",
    "description": "Elemento para accionar el paso de corriente en un circuito",
    "active": true
  },
  {
    "id": "P0065",
    "name": "Pulsador 4 Pines",
    "sku": "PUL-4P-01",
    "category": "Accionamiento",
    "price": 0.12,
    "stock": 100,
    "image": "img/pulsador_4p.jpg",
    "description": "Elemento para accionar el paso de corriente en un circuito",
    "active": true
  },
  {
    "id": "P0066",
    "name": "Pulsador rojo",
    "sku": "PUL-2P-02",
    "category": "Accionamiento",
    "price": 0.25,
    "stock": 15,
    "image": "img/pul_rojo.jfif",
    "description": "Elemento para accionar el paso de corriente en un circuito",
    "active": true
  },
  {
    "id": "P0067",
    "name": "DIP Switch 2 Int",
    "sku": "DIP-SW-01",
    "category": "Accionamiento",
    "price": 0.15,
    "stock": 15,
    "image": "img/dip_2.jfif",
    "description": "Elemento para accionar el paso de corriente en un circuito",
    "active": true
  },
  {
    "id": "P0068",
    "name": "DIP Switch 4 Int",
    "sku": "DIP-SW-02",
    "category": "Accionamiento",
    "price": 0.20,
    "stock": 15,
    "image": "img/dip_4.jfif",
    "description": "Elemento para accionar el paso de corriente en un circuito",
    "active": true
  },
  {
    "id": "P0069",
    "name": "DIP Switch 8 Int",
    "sku": "DIP-SW-03",
    "category": "Accionamiento",
    "price": 0.25,
    "stock": 15,
    "image": "img/dip_8.jpg",
    "description": "Elemento para accionar el paso de corriente en un circuito",
    "active": true
  },
  {
    "id": "P0070",
    "name": "Teclado Matricial 4x4",
    "sku": "TEC-MAT-01",
    "category": "Accionamiento",
    "price": 3.50,
    "stock": 1,
    "image": "img/teclado_mat.jpg",
    "description": "Elemento con varios botones para generar texto/contraseñas.",
    "active": true
  },
  {
    "id": "P0071",
    "name": "Teclado Matricial 4x4 Membrana",
    "sku": "TEC-MAT-02",
    "category": "Accionamiento",
    "price": 2.50,
    "stock": 1,
    "image": "img/teclado_membrada.jpg",
    "description": "Elemento con varios botones para generar texto/contraseñas.",
    "active": true
  },
  {
    "id": "P0072",
    "name": "Switch con palanca ",
    "sku": "SWT-2P-01",
    "category": "Accionamiento",
    "price": 0.50,
    "stock": 20,
    "image": "img/switch_pal.jfif",
    "description": "Elemento para accionar el paso de corriente en un circuito",
    "active": true
  },
  {
    "id": "P0073",
    "name": "Mini switch color negro",
    "sku": "MSW-CN-01",
    "category": "Accionamiento",
    "price": 0.40,
    "stock": 20,
    "image": "img/mini_sw.jpg",
    "description": "Elemento para accionar el paso de corriente en un circuito",
    "active": true
  },
  {
    "id": "P0074",
    "name": "Micro Switch",
    "sku": "USW-01-01",
    "category": "Accionamiento",
    "price": 0.60,
    "stock": 20,
    "image": "img/micro_sw.jfif",
    "description": "Elemento para accionar el paso de corriente en un circuito",
    "active": true
  },
  {
    "id": "P0075",
    "name": "Pulsador magnetico",
    "sku": "SWM-AZ-01",
    "category": "Accionamiento",
    "price": 0.15,
    "stock": 200,
    "image": "img/int_mag.jpg",
    "description": "Elemento para accionar el paso de corriente en un circuito",
    "active": true
  },
  {
    "id": "P0076",
    "name": "Pulsador 6 Pines",
    "sku": "PUL-6P-01",
    "category": "Accionamiento",
    "price": 0.55,
    "stock": 20,
    "image": "img/pul_6p.jpg",
    "description": "Elemento para accionar el paso de corriente en un circuito",
    "active": true
  },
  {
    "id": "P0077",
    "name": "Rele 5V 10A",
    "sku": "REL-5V-01",
    "category": "Reles",
    "price": 0.60,
    "stock": 12,
    "image": "img/rele_10a.jpg",
    "description": "Elemento que se acciona por campo magnetico.",
    "active": true
  },
  {
    "id": "P0078",
    "name": "Rele 12V 10A",
    "sku": "REL-12-01",
    "category": "Reles",
    "price": 0.60,
    "stock": 12,
    "image": "img/rele_12v.jfif",
    "description": "Elemento que se acciona por campo magnetico.",
    "active": true
  },
  {
    "id": "P0079",
    "name": "Cable UTP",
    "sku": "UTP-1M-01",
    "category": "Cables",
    "price": 0.50,
    "stock": 100,
    "image": "img/cable_utp.png",
    "description": "Cable para red de comunicacion internet o para proyectos.",
    "active": true
  },
  {
    "id": "P0080",
    "name": "Cable de Parlante",
    "sku": "AUD-RN-01",
    "category": "Cables",
    "price": 0.50,
    "stock": 100,
    "image": "img/cable_parl.jfif",
    "description": "Cable para audio y video.",
    "active": true
  },
  {
    "id": "P0081",
    "name": "Taipe",
    "sku": "CIN-TP-01",
    "category": "Herramientas",
    "price": 1.25,
    "stock": 100,
    "image": "img/taipe.jfif",
    "description": "Cinta de aislante electrico.",
    "active": true
  },
  {
    "id": "P0082",
    "name": "Rollo de termoencogible 12mm",
    "sku": "RLL-TE-01",
    "category": "Cables",
    "price": 1.0,
    "stock": 50,
    "image": "img/termo.jfif",
    "description": "Cable para aislar de calor/electricidad.",
    "active": true
  },
  {
    "id": "P0083",
    "name": "Cable lagarto-lagarto",
    "sku": "CLL-01-01",
    "category": "Cables",
    "price": 1.25,
    "stock": 20,
    "image": "img/macho_macho.jpg",
    "description": "Cable tipo pinza.",
    "active": true
  },
  {
    "id": "P0084",
    "name": "Jumpers macho-macho",
    "sku": "JUM-MM-01",
    "category": "Cables",
    "price": 0.10,
    "stock": 20,
    "image": "img/jumper_mm.jpg",
    "description": "Cable para protoboard.",
    "active": true
  },
  {
    "id": "P0085",
    "name": "Jumpers macho-hembra",
    "sku": "JUM-MH-01",
    "category": "Cables",
    "price": 0.10,
    "stock": 20,
    "image": "img/jumper_mh.jfif",
    "description": "Cable para protoboard.",
    "active": true
  },
  {
    "id": "P0086",
    "name": "Jumpers hembra-hembra",
    "sku": "JUM-HH-01",
    "category": "Cables",
    "price": 0.10,
    "stock": 20,
    "image": "img/jumper_hh.jpg",
    "description": "Cable para protoboard.",
    "active": true
  },
  {
    "id": "P0087",
    "name": "PCB fibra de vidrio",
    "sku": "PCB-FV-01",
    "category": "PCB",
    "price": 2.50,
    "stock": 10,
    "image": "img/pcb_fv.jpg",
    "description": "Placa de cobre para hacer prototipos",
    "active": true
  },
  {
    "id": "P0088",
    "name": "Papel termotransferible PCB amarillo",
    "sku": "PAP-TR-01",
    "category": "PCB",
    "price": 1.00,
    "stock": 100,
    "image": "img/termoenco.jpg",
    "description": "Hoja que transfiere tinta con el calor.",
    "active": true
  },
  {
    "id": "P0089",
    "name": "Galleta pequeña",
    "sku": "GLL-PN-01",
    "category": "PCB",
    "price": 2.00,
    "stock": 5,
    "image": "img/gll.jfif",
    "description": "Placa perforada para hacer prototipos.",
    "active": true
  },
  {
    "id": "P0090",
    "name": "Galleta mediana",
    "sku": "GLL-MD-01",
    "category": "PCB",
    "price": 3.00,
    "stock": 10,
    "image": "img/gll.jfif",
    "description": "Placa perforada para hacer prototipos.",
    "active": true
  },
  {
    "id": "P0091",
    "name": "Galleta pequeña verde",
    "sku": "GLL-PN-02",
    "category": "PCB",
    "price": 2.25,
    "stock": 10,
    "image": "img/gll_v.jpg",
    "description": "Placa perforada para hacer prototipos.",
    "active": true
  },
  {
    "id": "P0092",
    "name": "Protoboard mini",
    "sku": "PTB-MI-01",
    "category": "Protoboard",
    "price": 1.10,
    "stock": 7,
    "image": "img/ptb_p.jfif",
    "description": "Elemento para hacer varios prototipos de electronica.",
    "active": true
  },
  {
    "id": "P0093",
    "name": "Protoboard pequeño",
    "sku": "PTB-PQ-01",
    "category": "Protoboard",
    "price": 2.90,
    "stock": 5,
    "image": "img/ptb_400.jfif",
    "description": "Elemento para hacer varios prototipos de electronica.",
    "active": true
  },
  {
    "id": "P0094",
    "name": "Protoboard 1 regleta verde",
    "sku": "PTB-1R-01",
    "category": "Protoboard",
    "price": 5.25,
    "stock": 5,
    "image": "img/ptb_med.jpg",
    "description": "Elemento para hacer varios prototipos de electronica.",
    "active": true
  },
  {
    "id": "P0095",
    "name": "Protoboard 3 regletas verde",
    "sku": "PTB-3R-01",
    "category": "Protoboard",
    "price": 30.00,
    "stock": 7,
    "image": "img/ptb_3r.jpg",
    "description": "Elemento para hacer varios prototipos de electronica.",
    "active": true
  },
  {
    "id": "P0096",
    "name": "Protoboard 1 regleta blanco",
    "sku": "PTB-1R-01",
    "category": "Protoboard",
    "price": 7.00,
    "stock": 3,
    "image": "img/ptb_w.jpg",
    "description": "Elemento para hacer varios prototipos de electronica.",
    "active": true
  },
  {
    "id": "P0097",
    "name": "Caja de destornilladores x6",
    "sku": "CDT-06-01",
    "category": "Herramientas",
    "price": 8.00,
    "stock": 2,
    "image": "img/juego_dest.jfif",
    "description": "Herramienta para ajustar/aflojar tornillos.",
    "active": true
  },
  {
    "id": "P0098",
    "name": "Caja de destornilladores x7",
    "sku": "CDT-07-01",
    "category": "Herramientas",
    "price": 9.25,
    "stock": 2,
    "image": "img/dest_az.jfif",
    "description": "Herramienta para ajustar/aflojar tornillos.",
    "active": true
  },
  {
    "id": "P0099",
    "name": "Caja de destornilladores x6 pequeños",
    "sku": "CDT-PQ-01",
    "category": "Herramientas",
    "price": 3.75,
    "stock": 2,
    "image": "img/psu-5v-2a.jpg",
    "description": "Herramienta para ajustar/aflojar tornillos.",
    "active": true
  },
  {
    "id": "P0100",
    "name": "Brocas de tuxteno x1",
    "sku": "BTX-01-01",
    "category": "PCB",
    "price": 1.50,
    "stock": 3,
    "image": "img/tuxt.jfif",
    "description": "Herramienta para perforar cobre.",
    "active": true
  },
  {
    "id": "P0101",
    "name": "Brocas de tuxteno x6",
    "sku": "BTX-01-02",
    "category": "PCB",
    "price": 7.75,
    "stock": 3,
    "image": "img/tuxt_6.png",
    "description": "Herramienta para perforar cobre.",
    "active": true
  },
  {
    "id": "P0102",
    "name": "Portafusibles pequeño",
    "sku": "PTF-PQ-01",
    "category": "Fusibles",
    "price": 1.30,
    "stock": 10,
    "image": "img/porta_fus.jfif",
    "description": "Elemento para anclar el fusible en placa o proyecto.",
    "active": true
  },
  {
    "id": "P0103",
    "name": "Porta-pilas 2A",
    "sku": "POR-PI-2A",
    "category": "Alimentacion",
    "price": 1.25,
    "stock": 10,
    "image": "img/pilas_2a.jfif",
    "description": "Elemento para anclar pilas en la placa o proyecto.",
    "active": true
  },
  {
    "id": "P0104",
    "name": "Pinzas lagarto",
    "sku": "PIZ-LA-01",
    "category": "Alimentacion",
    "price": 0.90,
    "stock": 20,
    "image": "img/psu-5v-2a.jpg",
    "description": "Elemento para hacer conexiones.",
    "active": true
  },
  {
    "id": "P0105",
    "name": "Disipador TO-220",
    "sku": "DIS-TO-01",
    "category": "Alimentacion",
    "price": 1.30,
    "stock": 10,
    "image": "img/disip_to220.jfif",
    "description": "Elemento para disminuir la temperatura de un componente de potencia.",
    "active": true
  },
  {
    "id": "P0106",
    "name": "Fusible de 120VAC -2A",
    "sku": "FUS-120-AC",
    "category": "Fusibles",
    "price": 0.80,
    "stock": 10,
    "image": "img/fus.png",
    "description": "Elemento para proteguer a los circuitos de sobrecorrientes.",
    "active": true
  },
  {
    "id": "P0107",
    "name": "Portapilas CR2032",
    "sku": "POR-CR-01",
    "category": "Alimentacion",
    "price": 1.25,
    "stock": 10,
    "image": "img/pp.jfif",
    "description": "Elemento para anclar pilas en la placa o proyecto.",
    "active": true
  },
  {
    "id": "P0108",
    "name": "Zocalos",
    "sku": "ZOC-01-01",
    "category": "PCB",
    "price": 1.15,
    "stock": 10,
    "image": "img/zoc.jpg",
    "description": "Elemento para anclar circuitos integrados a una placa .",
    "active": true
  },
  {
    "id": "P0109",
    "name": "Condensadores 0,1uf-470uf",
    "sku": "CDR-EL-01",
    "category": "Condensadores",
    "price": 1.13,
    "stock": 10,
    "image": "img/condensador.jpg",
    "description": "Elemento que guarda energia en forma de campo electrico.",
    "active": true
  },
  {
    "id": "P0110",
    "name": "Condensadores ceramicos baja tension",
    "sku": "CDR-CR-01",
    "category": "Condensadores",
    "price": 0.40,
    "stock": 10,
    "image": "img/ceramico.jpg",
    "description":"Elemento que guarda energia en forma de campo electrico.",
    "active": true
  },
  {
    "id": "P0111",
    "name": "Condensadores ceramicos media tension",
    "sku": "CDR-CR-02",
    "category": "Condensadores",
    "price": 0.75,
    "stock": 10,
    "image": "img/mt.jfif",
    "description": "Elemento que guarda energia en forma de campo electrico.",
    "active": true
  },
  {
    "id": "P0112",
    "name": "Potenciometro",
    "sku": "PTR-01-01",
    "category": "Resistencias para electronica",
    "price": 0.30,
    "stock": 10,
    "image": "img/pot.jpg",
    "description": "Elemento que sirve para proteccion de circuitos.",
    "active": true
  },
  {
    "id": "P0113",
    "name": "Motor mediano",
    "sku": "MOT-MD-01",
    "category": "Motores",
    "price": 1.75,
    "stock": 10,
    "image": "img/mmed.jfif",
    "description": "Elemento que se mueve por fuerza electromotriz.",
    "active": true
  },
  {
    "id": "P0114",
    "name": "Paneles solar 6v",
    "sku": "PNL-SO-01",
    "category": "Paneles solares",
    "price": 3.25,
    "stock": 10,
    "image": "img/psolar.jfif",
    "description": "Elemento que guarda la energia de la luz.",
    "active": true
  },
  {
    "id": "P0115",
    "name": "Varistores",
    "sku": "VAR-MT-01",
    "category": "Alimentacion",
    "price": 1.75,
    "stock": 10,
    "image": "img/var.jpg",
    "description": "Elemnto para porteger al circuito de picos de voltaje.",
    "active": true
  },
  {
    "id": "P0116",
    "name": "LM 317",
    "sku": "LM3-17-01",
    "category": "CI y Amplificadores",
    "price": 0.80,
    "stock": 20,
    "image": "img/lm317.jpg",
    "description": "Elemento hacer una fuente de voltaje.",
    "active": true
  },
  {
    "id": "P0117",
    "name": "BT-136",
    "sku": "BT1-36-01",
    "category": "CI y Amplificadores",
    "price": 0.90,
    "stock": 20,
    "image": "img/bt136.jpg",
    "description": "Elemento para accionar equipos de alta potencia.",
    "active": true
  },
  {
    "id": "P0118",
    "name": "IRFZ-44N",
    "sku": "IRF-Z4-4N",
    "category": "CI y Amplificadores",
    "price": 0.95,
    "stock": 20,
    "image": "img/irfz.jpg",
    "description": "Elemento que se activa por campo electrico.",
    "active": true
  },
  {
    "id": "P0119",
    "name": "TIP 32",
    "sku": "TIP-32-01",
    "category": "CI y Amplificadores",
    "price": 0.70,
    "stock": 20,
    "image": "img/tip32.jfif",
    "description": "Elemento que se activa por campo electrico.",
    "active": true
  },
  {
    "id": "P0120",
    "name": "TIP 122 ",
    "sku": "TIP-12-01",
    "category": "CI y Amplificadores",
    "price": 1.00,
    "stock": 20,
    "image": "img/tip32.jfif",
    "description": "Elemento que se activa por campo electrico.",
    "active": true
  },
  {
    "id": "P0121",
    "name": "BT-151",
    "sku": "BT1-51-01",
    "category": "CI y Amplificadores",
    "price": 1.40,
    "stock": 20,
    "image": "img/tip32.jfif",
    "description": "Elemento para accionar equipos de alta potencia.",
    "active": true
  },
  {
    "id": "P0122",
    "name": "LM 311",
    "sku": "LM3-11-01",
    "category": "CI y Amplificadores",
    "price": 2.50,
    "stock": 10,
    "image": "img/lm317.jpg",
    "description": "Elemento que amplifica voltaje/corriente.",
    "active": true
  },
  {
    "id": "P0123",
    "name": "L 293",
    "sku": "L29-30-01",
    "category": "CI y Amplificadores",
    "price": 1.50,
    "stock": 10,
    "image": "img/l293.jfif",
    "description": "Elemento que amplifica voltaje/corriente.",
    "active": true
  },
  {
    "id": "P0124",
    "name": "MOC 4N25",
    "sku": "MOC-4N-01",
    "category": "CI y Amplificadores",
    "price": 0.80,
    "stock": 10,
    "image": "img/moc.jfif",
    "description": "Elemento que se acciona por luz.",
    "active": true
  },
  {
    "id": "P0125",
    "name": "Barra de leds 8",
    "sku": "BRR-8L-01",
    "category": "Leds",
    "price": 0.98,
    "stock": 15,
    "image": "img/bl.jfif",
    "description": "Barra interna de leds.",
    "active": true
  },
  {
    "id": "P0126",
    "name": "74373",
    "sku": "CI7-43-73",
    "category": "CI y Amplificadores",
    "price": 1.00,
    "stock": 10,
    "image": "img/74373.jpg",
    "description": "Circuito integrado que guarda datos.",
    "active": true
  },
  {
    "id": "P0127",
    "name": "7400",
    "sku": "CI7-40-00",
    "category": "CI y Amplificadores",
    "price": 0.65,
    "stock": 20,
    "image": "img/7400.jpeg",
    "description": "Cicuito integrado tipo NAND.",
    "active": true
  },
  {
    "id": "P0128",
    "name": "7402",
    "sku": "CI7-40-20",
    "category": "CI y Amplificadores",
    "price": 0.70,
    "stock": 15,
    "image": "img/7400.jpeg",
    "description": "Circuito integrado tipo XNOR.",
    "active": true
  },
  {
    "id": "P0129",
    "name": "7483",
    "sku": "CI7-48-30",
    "category": "CI y Amplificadores",
    "price": 1.9,
    "stock": 10,
    "image": "img/7400.jpeg",
    "description": "Circuito integrado sumador.",
    "active": true
  },
  {
    "id": "P0130",
    "name": "7404",
    "sku": "CI7-40-40",
    "category": "CI y Amplificadores",
    "price": 0.70,
    "stock": 20,
    "image": "img/7400.jpeg",
    "description": "Cicuito integrado tipo NOT.",
    "active": true
  },
  {
    "id": "P0131",
    "name": "7405",
    "sku": "CI7-41-05",
    "category": "CI y Amplificadores",
    "price": 0.80,
    "stock": 20,
    "image": "img/7400.jpeg",
    "description": "Cicuito integrado tipo NOT.",
    "active": true
  },
  {
    "id": "P0132",
    "name": "7408",
    "sku": "CI7-40-80",
    "category": "CI y Amplificadores",
    "price": 0.60,
    "stock": 20,
    "image": "img/7400.jpeg",
    "description": "Cicuito integrado tipo AND.",
    "active": true
  },
  {
    "id": "P0133",
    "name": "PC 817",
    "sku": "PC8-17-01",
    "category": "CI y Amplificadores",
    "price": 0.40,
    "stock": 20,
    "image": "img/pc817.jfif",
    "description": "Circuito que se acciona por luz.",
    "active": true
  },
  {
    "id": "P0134",
    "name": "7410",
    "sku": "CI7-41-00",
    "category": "CI y Amplificadores",
    "price": 0.80,
    "stock": 10,
    "image": "img/7400.jpeg",
    "description": "Circuito integrado AND de 3 entradas.",
    "active": true
  },
  {
    "id": "P0135",
    "name": "7420",
    "sku": "CI7-42-00",
    "category": "CI y Amplificadores",
    "price": 0.80,
    "stock": 10,
    "image": "img/7400.jpeg",
    "description": "Circuito integrado NAND de 4 entradas.",
    "active": true
  },
  {
    "id": "P0136",
    "name": "OLED",
    "sku": "OLE-00-01",
    "category": "Pantallas",
    "price": 0.80,
    "stock": 10,
    "image": "img/olcd.jfif",
    "description": "Pantalla para programar y visualizar projectos.",
    "active": true
  },
  {
    "id": "P0137",
    "name": "Modulo CR2032",
    "sku": "MOD-CR-32",
    "category": "Modulo",
    "price": 0.80,
    "stock": 10,
    "image": "img/mod_cr2032.jfif",
    "description": "Alimentación de respaldo o de bajo consumo para mantener funciones como la hora y la configuración del sistema.",
    "active": true
  },
  {
    "id": "P0138",
    "name": "Modulo PWM",
    "sku": "MOD-PW-M0",
    "category": "Modulo",
    "price": 0.80,
    "stock": 10,
    "image": "img/pwm.jfif",
    "description": "Modulo de potencia para mover motores o circuitos de alta corriente.",
    "active": true
  },
  {
    "id": "P0139",
    "name": "KIT CARRO ",
    "sku": "KIT-CA-00",
    "category": "KIT",
    "price": 0.80,
    "stock": 10,
    "image": "img/kit_rob.jfif",
    "description": "Kit de carro electronico para proyectos educativos .",
    "active": true
  },
  {
    "id": "P0140",
    "name": "ESP32 + CAMARA",
    "sku": "ESP-00-02",
    "category": "Microcontroladores",
    "price": 0.80,
    "stock": 10,
    "image": "img/olcd.jfif",
    "description": "Microcontrolador para procesamiento de imagenes.",
    "active": true
  },
  {
    "id": "P0141",
    "name": "KIT MODULO ECG AD8232",
    "sku": "KIT-MO-EC",
    "category": "Kit",
    "price": 0.80,
    "stock": 10,
    "image": "img/sen_pul.jfif",
    "description": "Modulo para medir los pulsos del corazón.",
    "active": true
  },
  {
    "id": "P0142",
    "name": "TDA 2003,2030,2005",
    "sku": "TDA-00-01",
    "category": "Amplificadores",
    "price": 0.80,
    "stock": 10,
    "image": "img/tdax.jfif",
    "description": "Toma una señal de entrada débil y aumentar su nivel de amplitud.",
    "active": true
  },
  {
    "id": "P0143",
    "name": "KIT CARRO",
    "sku": "KIT-CA-02",
    "category": "Kit",
    "price": 0.80,
    "stock": 10,
    "image": "img/car.jfif",
    "description": "Kit de carro electronico para proyectos educativos.",
    "active": true
  },
  {
    "id": "P0144",
    "name": "Puente H",
    "sku": "PTH-00-01",
    "category": "Modulo",
    "price": 0.80,
    "stock": 10,
    "image": "img/ph.jfif",
    "description": "Modulo para mover motores de media y baja corriente.",
    "active": true
  },
  {
    "id": "P0145",
    "name": "Modulo MQ35",
    "sku": "MOD-MQ-35",
    "category": "Modulo",
    "price": 0.80,
    "stock": 10,
    "image": "img/mq35.jfif",
    "description": "Modulo para medir la cantidad de gas en el medio ambiente.",
    "active": true
  },
  {
    "id": "P0146",
    "name": "Flash tipo pulsera",
    "sku": "FSH-00-01",
    "category": "Kit",
    "price": 0.80,
    "stock": 10,
    "image": "img/flash.jfif",
    "description": "Memoria tipo pulsera para llevar a cualquier lado.",
    "active": true
  },
  {
    "id": "P0147",
    "name": "Interruptor rojo",
    "sku": "INT-RJ-01",
    "category": "Interruptor",
    "price": 0.80,
    "stock": 10,
    "image": "img/push_red.jfif",
    "description": "Elemento para abrir y cerrar corriente en un circuito.",
    "active": true
  },
  {
    "id": "P0148",
    "name": "Modulo de Fotorresistencia",
    "sku": "MOD-FR-02",
    "category": "Modulo ",
    "price": 0.80,
    "stock": 10,
    "image": "img/mod_fr.jfif",
    "description": "Modulo para medir la cantidad de luz en un medio ambiente.",
    "active": true
  },
  {
    "id": "P0149",
    "name": "Sensor de obstaculos",
    "sku": "MOD-SE-OB",
    "category": "Modulo",
    "price": 0.80,
    "stock": 10,
    "image": "img/sen_obs.jfif",
    "description": "Modulo para medir el color blanco y negro de un entorno.",
    "active": true
  },
  {
    "id": "P0150",
    "name": "Modulo de carro 2",
    "sku": "KIT-MC-02",
    "category": "Kit",
    "price": 0.80,
    "stock": 10,
    "image": "img/carr_01.jfif",
    "description": "Kit de carro electronico para proyectos educativos.",
    "active": true
  },
  {
    "id": "P0151",
    "name": "Bateria de litio de 3.7v 300mAh",
    "sku": "BAT-LT-01",
    "category": "Alimentacion",
    "price": 0.80,
    "stock": 10,
    "image": "img/litio.jfif",
    "description": "Alimentacion de litio para proyectos y para equipos.",
    "active": true
  },
  {
    "id": "PROJ-001",
    "name": "Timbre Automatico",
    "sku": "TIM-AUTO",
    "category": "Proyectos",
    "price": 120.00, 
    "stock": 2,
    "image": "img/TIMBRE.jfif", // Foto real estilo Instagram
    "description": "Timbre programable para escuelas , colegios e indutrias.",
    "active": true
  },
  {
    "id": "PROJ-002",
    "name": "Analizador Monofasico",
    "sku": "ANAL-MONO",
    "category": "Proyectos",
    "price": 250.00,
    "stock": 1,
    "image": "img/md1.jfif",
    "description": "Equipo educativo para visualizacion de señales electricas.",
    "active": true
  },
  {
    "id": "PROJ-003",
    "name": "Estaciones de energia",
    "sku": "STAY-ENER",
    "category": "Proyectos",
    "price": 250.00,
    "stock": 1,
    "image": "img/PS.jfif",
    "description": "Equipo para apagones.",
    "active": true
  }


];

// ==========================================
// 2. FUNCIONES DE DIBUJO (VISUALIZACIÓN)
// ==========================================

let carrito = []; // Aquí guardaremos los productos seleccionados

// Función para añadir al carrito (Reemplaza la alerta antigua)
function agregarAlCarrito(nombre, precio, sku) {
    // Agregamos el objeto al array
    carrito.push({ nombre, precio, sku });
    
    // Actualizamos el numerito rojo
    actualizarContador();
    
    // Feedback visual simple
    alert(`¡Agregado! ${nombre}\nAhora tienes ${carrito.length} productos en el carrito.`);
}

function actualizarContador() {
    const contador = document.getElementById('contador-carrito');
    if(contador) {
        contador.innerText = carrito.length;
    }
}

// Función al hacer clic en el ICONO DEL CARRITO
function verCarrito() {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío. ¡Agrega algunos componentes!");
        return;
    }

    // Calculamos el total
    let total = 0;
    let mensaje = "Hola MKECUADOR, quiero comprar lo siguiente:\n\n";

    carrito.forEach((prod, index) => {
        mensaje += `${index + 1}. ${prod.nombre} - $${prod.precio.toFixed(2)}\n`;
        total += prod.precio;
    });

    mensaje += `\n*TOTAL A PAGAR: $${total.toFixed(2)}*`;

    // Preguntamos si quiere ir a WhatsApp
    if (confirm(`Resumen del pedido:\n\n${mensaje}\n\n¿Enviar pedido por WhatsApp?`)) {
        
        // --- AQUÍ ES DONDE PONES TU NÚMERO ---
        // Sin el signo +, sin espacios y con el código de país (593)
        const telefono = "593994145131"; 
        // -------------------------------------

        const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, '_blank');
    }
}
// --- FUNCIÓN PARA VACIAR EL CARRITO (REGRESAR A CERO) ---
function vaciarCarrito() {
    // 1. Si ya está vacío, no hacemos nada
    if (carrito.length === 0) {
        alert("El carrito ya está vacío.");
        return;
    }

    // 2. Preguntamos para confirmar (por seguridad)
    if (confirm("¿Estás seguro de que quieres BORRAR todo el pedido y empezar de cero?")) {
        carrito = []; // Aquí es donde "regresa a cero" la lista
        actualizarContador(); // Actualizamos el numerito rojo a 0
        alert("Carrito vaciado. Puedes empezar de nuevo.");
    }
}

// ==========================================
// 3. LÓGICA DE LA LUPA (BUSCADOR)
// ==========================================

function toggleBuscador() {
    const input = document.getElementById('input-busqueda-nav');
    input.classList.toggle('activo'); // Muestra u oculta el input
    if (input.classList.contains('activo')) {
        input.focus(); // Pone el cursor para escribir
    }
}

function buscarDesdeNav(event) {
    // Si presiona ENTER (Tecla 13)
    if (event.key === 'Enter') {
        const busqueda = event.target.value.toLowerCase();
        
        // Verificamos en qué página estamos
        if (window.location.pathname.includes('componentes.html')) {
            // Si ya estamos en componentes, usamos la función de filtro existente
            const inputPrincipal = document.getElementById('buscador');
            if(inputPrincipal) {
                inputPrincipal.value = busqueda;
                buscarProducto(); // Llamamos a la función de filtro
            }
        } else {
            // Si estamos en Inicio, redirigimos a componentes (Truco)
            alert(`Yendo al catálogo para buscar: "${busqueda}"...`);
            window.location.href = "componentes.html";
        }
    }
}

// ==========================================
// 4. FUNCIONES DE DIBUJO (Standard)
// ==========================================

function crearTarjeta(producto) {
    let contenidoVisual;
    if (!producto.image || producto.image === "img/") {
        contenidoVisual = `<i class="fa-solid fa-microchip placeholder-icon"></i>`;
    } else {
        contenidoVisual = `<img src="${producto.image}" alt="${producto.name}" onerror="this.onerror=null; this.parentElement.innerHTML='<i class=\\'fa-solid fa-triangle-exclamation placeholder-icon\\'></i>'">`;
    }

    return `
        <div class="product-card">
            <div class="product-img">${contenidoVisual}</div>
            <div class="product-info">
                <h3>${producto.name}</h3>
                <p class="desc">${producto.description}</p>
                <div class="price-row">
                    <span class="price" style="font-size: 1rem; color: #666;">Consultar</span>
                    <button class="add-btn" onclick="agregarAlCarrito('${producto.name}', ${producto.price}, '${producto.sku}')">
                        <i class="fa-solid fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function cargarPagina() {
    const gridInicio = document.getElementById('grid-inicio');
    const gridTodos = document.getElementById('grid-todos');
    const productosActivos = listaProductos.filter(p => p.active === true);

    if (gridInicio) {
        gridInicio.innerHTML = productosActivos.slice(0, 4).map(p => crearTarjeta(p)).join('');
    }
    if (gridTodos) {
        gridTodos.innerHTML = productosActivos.map(p => crearTarjeta(p)).join('');
    }
    
    // Buscar productos normales (filtro de página componentes)
    window.buscarProducto = function() {
        const texto = document.getElementById('buscador').value.toLowerCase();
        const resultado = listaProductos.filter(p => 
            p.active && (p.name.toLowerCase().includes(texto) || p.category.toLowerCase().includes(texto))
        );
        if (gridTodos) gridTodos.innerHTML = resultado.map(p => crearTarjeta(p)).join('');
    }

    // Filtrar por botones
    window.filtrarProductos = function(cat) {
        const resultado = cat === 'todos' ? productosActivos : productosActivos.filter(p => p.category.toLowerCase() === cat.toLowerCase());
        if (gridTodos) gridTodos.innerHTML = resultado.map(p => crearTarjeta(p)).join('');
    }
}
// --- NUEVA FUNCIÓN ESPECIAL PARA TARJETAS DE PROYECTOS ---
function crearTarjetaProyecto(producto) {
    return `
        <div class="project-card">
            <img src="${producto.image}" alt="${producto.name}" class="project-img-full">
            
            <div class="project-overlay">
                <h3>${producto.name}</h3>
                <p>${producto.description}</p>
                
                <div style="display:flex; justify-content: center; align-items:center; margin-top: 15px;">
                    
                    <button class="project-btn" onclick="interesProyecto('${producto.name}')">
                        ME INTERESA
                    </button>
                </div>
            </div>
        </div>
    `;
}

// --- ACTUALIZA TU FUNCIÓN CARGAR PAGINA ---
function cargarPagina() {
    const gridInicio = document.getElementById('grid-inicio');
    const gridTodos = document.getElementById('grid-todos');
    const gridKits = document.getElementById('grid-kits');
    const gridRobotica = document.getElementById('grid-robotica');
    
    // NUEVO: Grid de Proyectos
    const gridProyectos = document.getElementById('grid-proyectos');

    const productosActivos = listaProductos.filter(p => p.active === true);

    // ... (Tu código anterior para Inicio, Todos, Kits, Robotica sigue igual) ...
    if (gridInicio) gridInicio.innerHTML = productosActivos.slice(0, 4).map(p => crearTarjeta(p)).join('');
    if (gridTodos) gridTodos.innerHTML = productosActivos.map(p => crearTarjeta(p)).join('');
    if (gridKits) {
        const soloKits = productosActivos.filter(p => p.category === "Kits");
        gridKits.innerHTML = soloKits.map(p => crearTarjeta(p)).join('');
    }
    if (gridRobotica) {
        const soloRobots = productosActivos.filter(p => p.category === "Robotica");
        gridRobotica.innerHTML = soloRobots.map(p => crearTarjeta(p)).join('');
    }

    // --- AQUÍ ESTÁ LA MAGIA NUEVA ---
    if (gridProyectos) {
        const soloProyectos = productosActivos.filter(p => p.category === "Proyectos");
        // Usamos la función NUEVA "crearTarjetaProyecto" en lugar de la normal
        gridProyectos.innerHTML = soloProyectos.map(p => crearTarjetaProyecto(p)).join('');
    }
}
function interesProyecto(nombre) {
    const telefono = "593994145131"; // El número que pediste
    const mensaje = `Hola MKECUADOR, estoy viendo su página web y ME INTERESA el proyecto: ${nombre}. ¿Podrían darme más información?`;
    
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}

document.addEventListener('DOMContentLoaded', cargarPagina);