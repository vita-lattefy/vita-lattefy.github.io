/* ------------------------------------------------------------------------------------------------- */
/* ---------------------------------------- UPLOAD PURCHASE ---------------------------------------- */
/* ------------------------------------------------------------------------------------------------- */

// Display Function
const functionHeader = document.getElementById('function-header')
const functionSelector = document.getElementById('function-selector')
const addInputs = document.getElementById('add-points-inputs')
const claimInputs = document.getElementById('claim-gift-inputs')

function toggleInputs() {
    const selectedFunction = functionSelector.value
    console.log(selectedFunction)
    
    if (selectedFunction === 'add-points') {
        functionHeader.innerHTML = 'Sumar Cuevita'
        addInputs.style.display = 'flex'
        claimInputs.style.display = 'none'
    } else if (selectedFunction === 'claim-gift') {
        functionHeader.innerHTML = 'Reclamar Regalo'
        addInputs.style.display = 'none'
        claimInputs.style.display = 'flex'
    }
}

functionSelector.addEventListener('change', toggleInputs)
toggleInputs()

function checkSelector () {
    return functionSelector.value
}


// Validate Inputs 

function validatePhoneNumber (phoneNumber) {

    let phoneInput
    if (document.getElementById('phone-add')) {
        phoneInput = document.getElementById('phone-add')
    } else if (document.getElementById('phone-gift')) {
        phoneInput = document.getElementById('phone-add')
    } else {
        phoneInput = document.getElementById('phoneNumber')
    }
   
    const phonePattern = /^09\d{7}$/ // starts with 09 and is 9 digits
    if (!phonePattern.test(phoneNumber)) {
        phoneInput.style.borderColor = 'red'
        alert('El celular debe comenzar con 09 y tener 9 dígitos')
        valid = false
    } else {
        phoneInput.style.borderColor = ''
    }
  
}

// Upload Purchase
async function uploadPurchase (phoneNumber, amountSpentNow) {

    validatePhoneNumber(phoneNumber)
    const amountSpentNowNum = parseFloat(amountSpentNow)
    if (isNaN(amountSpentNowNum)) {
        alert('Importe invalido:', amountSpentNow)
        return
    }

    const client = await getClientByPhoneNumber(phoneNumber)

    if (client && client.currentPoints < 5) {  

        const totalExpenditure = client.totalSpent + amountSpentNowNum

        let currentPoints = client.currentPoints + 1
        const totalPoints = client.totalPoints + 1

        let averageExpenditure

        if (totalPoints != 0) {
            averageExpenditure = totalExpenditure / totalPoints
        } else {
            averageExpenditure = 0
        }

        const updates = {}

        if (currentPoints == 3) {
            updates.discountAvailable = true
            sendFileEmail(client, 'discount')
        } else if (currentPoints == 5) {
            updates.giftAvailable = true
            sendFileEmail(client, 'gift')
        }
        alert(`Se ha agregado una vita: ${currentPoints}/5`)

        updates.currentPoints = currentPoints
        updates.totalPoints = totalPoints
        updates.totalSpent = totalExpenditure
        updates.averageExpenditure = averageExpenditure.toFixed(2)

        await updateClient(phoneNumber, updates)
        console.log('Se ha cargado la compra con exito!')

    } else if (client && client.currentPoints == 5) {
        alert(`${client.currentPoints}/5: El cliente debe reclamar su cafe gratis`)
    } else {
        alert('No se ha encontrado el cliente.')
    }

}

// Claim Gift
async function claimGift (phoneNumber) {

    phoneNumber = phoneNumber.trim()

    const client = await getClientByPhoneNumber(phoneNumber)

    console.log(client)

    if (client) {

        const updates = {}

        if (client.currentPoints >= 3 && client.discountAvailable == true) {
            updates.discountAvailable = false
            alert(`${client.currentPoints}/5: El cliente reclamo un 15% de descuento`)

        } else if (client.currentPoints == 5 && client.giftAvailable == true) {
            updates.currentPoints = client.currentPoints - 5
            updates.discountAvailable = false
            updates.giftAvailable = false
            updates.claimedGifts = client.claimedGifts + 1
            alert(`${client.currentPoints}/5: El cliente reclamo una burger gratis`)

        } else {
            alert(`El cliente no tiene ningun regalo: ${client.currentPoints}/5`)
        }

        await updateClient(phoneNumber, updates)
        console.log('Se ha reclamado el regalo con exito!')

    } else {
        alert('No se ha encontrado el cliente.')
    }

}
