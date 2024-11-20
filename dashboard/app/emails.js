// Function to send emails using EmailJS

const images = {
   discount: 'https://res.cloudinary.com/db87ezvoh/image/upload/v1732130281/gift_tedae8.png',
   gift: 'https://res.cloudinary.com/db87ezvoh/image/upload/v1732130281/gift_tedae8.png'
}

const titles = {
    discount: '¡Ganaste un 15% OFF en tu proxima compra!',
    gift: '¡Reclama tu cafe 100% gratis!'
}

let imageUrl
let title

async function sendFileEmail(client, why) {

    if (why == 'gift') {
        imageUrl = images.gift
        title = titles.gift
    } else if (why == 'discount') {
        imageUrl = images.discount
        title = titles.discount
    }

    try {
    
        const templateParams = {
            to_email: client.email,
            name: client.name,
            title: title,
            image_url: imageUrl || ''
        }

        const serviceID = 'service_o2dl7in';
        const templateID = 'template_0xwwptb';

        await emailjs.send(serviceID, templateID, templateParams)
    

        console.log('Email sent successfully')
    } 
    catch (error) {
        console.error('Error sending email:', error)
    }
    
}
