async function submitForm() {
    try {
        let name = document.querySelector('input[name="inputname"]');
        let category = document.querySelector('input[name="inputcategory"]');
        let price = document.querySelector('input[name="inputprice"]');
        let description = document.querySelector('input[name="inputdescription"]');

        const record = {
            name: validateText(name.value, 1, 150) ? name.value.trim() : false,
            category: validateText(category.value, 1, 150) ? category.value.trim() : false,
            price: validatePrice(price.value) ? "$" + parseFloat(price.value).toFixed(2) : false,
            description: validateText(description.value, 1, 256) ? description.value.trim() : false
        };

        let errors = [];
        // Validar si el objeto tiene una propiedad como false.
        for (let prop in record) {
            if (record[prop] === false) {
                errors.push(prop);
            }
        }

        if(errors.length > 0) {
            let msjErr = "";
            console.log(errors);
            errors.forEach(elem => {
                msjErr += `El elemento ${elem} contiene errores. `; 
            });
            throw new Error(msjErr);
        }

        // Insert Product
        await insertProduct(record);

        clearInput(name, category, price, description);
    } catch (error) {
        alert(error);
    } finally {
        console.log("Ejecutando finally...");
    }
}

function clearInput(name, category, price, description) {
    if (name.value != "") name.value = "";
    if (category.value != "") category.value = "";
    if (price.value != "") price.value = "";
    if (description.value != "") description.value = "";
}

function validateText(text, min, max) {
    if (isNaN(text) && text != null) {
        if (text.trim().length > min && text.trim().length < max) {
            return true;
        }
    }
    return false;
}

function validatePrice(num1) {
    const num = parseFloat(num1);
    if (!isNaN(num) && num > 0) {
        return true;
    }
    return false;
}

// DOM Manipulation
function createTableRow(record) {
    const tr = document.createElement("tr");
    const recordNodes = {
        name: createTableRowElement(record.name),
        category: createTableRowElement(record.category),
        price: createTableRowElement(record.price),
        description: createTableRowElement(record.description),
    };
    tr.append(recordNodes.name);
    tr.append(recordNodes.category);
    tr.append(recordNodes.price);
    tr.append(recordNodes.description);
    // tr.append(recordNodes.date);

    document.querySelector("tbody").append(tr);
}

function createTableRowElement(content) {
    const td = document.createElement("td");
    td.innerHTML = content;
    return td;
}

async function getProducts() {
    const res = await fetch('https://bootcamp-mock-api.vercel.app/getProducts');
    const data = await res.json();
    console.log(data);
    const table = document.querySelector("tbody");
    table.innerHTML = "";
    data.forEach(product => {
        createTableRow(product);
    });
}

async function insertProduct(record) {
    console.log('Aqui')
    const res = await fetch('https://bootcamp-mock-api.vercel.app/insertProduct', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(record)
    });
    const data = await res.json();
    return data;
}



try{
    setInterval( async() => {
        getProducts();
    }, 1000);
}catch(err) {
    console.error(err);
}




