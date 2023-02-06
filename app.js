const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

const { getResponse } = require("./openai.js")

const client = new Client({
    authStrategy: new LocalAuth(),
});

const ACTION_GREETING = "-hey";
const ACTION_TIP = "-tip";
const ACTION_QUESTION = "-q";
const ACTION_RESUME = "-sumup";
const ACTION_THANKS = "-thanks";

function greetingHourBased(persona) {
    const horaActual = new Date();
    const horas = horaActual.getHours();
    const minutos = horaActual.getMinutes().toString().padStart(2, '0');
    const saludos = ['Buenos días', 'Buenas tardes', 'Buenas noches'];
    const saludo = horas >= 6 && horas < 12 ? saludos[0] :
        horas >= 12 && horas < 19 ? saludos[1] : saludos[2];

    return `${saludo}, ${persona}. Ahora son las ${horas}:${minutos}. En que te puedo ayudar?`;
}

console.log("Bootstrapping...")

client.on('loading_screen', (percent, message) => {
    console.log('LOADING SCREEN', percent, message);
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message_create', async (message) => {

    if (message.body.startsWith(ACTION_GREETING)) {
        var chat = await message.getChat()
        chat.sendMessage(`😎 ${greetingHourBased("*Leo*")}`)
    }

    if (message.body.startsWith(ACTION_TIP)) {
        var chat = await message.getChat()
        const body = message.body.replace(ACTION_TIP, "")
        chat.sendMessage("🔍 Buscando el tip:")
        const response = await getResponse(`Dame un tip para ${body}. Explica brevemente en menos de 30 palabras.`)
        chat.sendMessage("😜 *Aquí tienes:*")
        chat.sendMessage(response.trim())
    }

    if (message.body.startsWith(ACTION_QUESTION)) {
        var chat = await message.getChat()
        const body = message.body.replace(ACTION_QUESTION, "")
        chat.sendMessage("🔍 Lo estoy pensando:")
        const response = await getResponse(`${body}. Explica brevemente en menos de 30 palabras, y también dame una URL corta de búsqueda para seguir leyendo.`)
        chat.sendMessage("📖 *Ya lo tengo. Mira:*")
        chat.sendMessage(response.trim())
    }

    if (message.body.startsWith(ACTION_RESUME)) {
        var chat = await message.getChat()
        const body = message.body.replace(ACTION_RESUME, "")
        chat.sendMessage("🔍 Resumiendo:")
        const response = await getResponse(
            `Resume el siguiente texto en menos de 30 palabras: 
            
            ${body}
            `
        )
        chat.sendMessage("✴️ *Este es un resumen simple:*")
        chat.sendMessage(response.trim())
    }

    if (message.body.startsWith(ACTION_THANKS)) {
        var chat = await message.getChat()
        chat.sendMessage(`😎 No hay problema. Estoy para ayudar.`)
    }

})

client.initialize();