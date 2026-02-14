const fs = require('fs');
const https = require('https');
const path = require('path');

// Product images from seed data
const products = [
    { name: "tomatoes", url: "https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=400" },
    { name: "carrots", url: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400" },
    { name: "spinach", url: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400" },
    { name: "potatoes", url: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400" },
    { name: "onions", url: "https://images.unsplash.com/photo-1587049352846-4a222e784720?w=400" },
    { name: "bell-peppers", url: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400" },
    { name: "broccoli", url: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400" },
    { name: "cauliflower", url: "https://images.unsplash.com/photo-1568584711271-61dd5c7e7f8c?w=400" },
    { name: "cucumber", url: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=400" },
    { name: "lettuce", url: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400" },

    { name: "apples", url: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400" },
    { name: "bananas", url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400" },
    { name: "oranges", url: "https://images.unsplash.com/photo-1547514701-42782101795e?w=400" },
    { name: "strawberries", url: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400" },
    { name: "grapes", url: "https://images.unsplash.com/photo-1599819177423-7c4e71099e4c?w=400" },
    { name: "mangoes", url: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400" },
    { name: "watermelon", url: "https://images.unsplash.com/photo-1587049352846-4a222e784720?w=400" },
    { name: "pineapple", url: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400" },
    { name: "papaya", url: "https://images.unsplash.com/photo-1617112848923-cc2234396a8d?w=400" },
    { name: "pomegranate", url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400" },

    { name: "milk", url: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400" },
    { name: "cheese", url: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400" },
    { name: "yogurt", url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400" },
    { name: "butter", url: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400" },
    { name: "paneer", url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400" },
    { name: "eggs", url: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400" },
    { name: "cream", url: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400" },

    { name: "bread", url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400" },
    { name: "croissants", url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400" },
    { name: "cake", url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400" },
    { name: "cookies", url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400" },
    { name: "muffins", url: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400" },
    { name: "bagels", url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400" },

    { name: "orange-juice", url: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400" },
    { name: "green-tea", url: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400" },
    { name: "coffee", url: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400" },
    { name: "water", url: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400" },
    { name: "cola", url: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400" },
    { name: "energy-drink", url: "https://images.unsplash.com/photo-1622543925917-763c34f4dbd6?w=400" },
    { name: "lemonade", url: "https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9d?w=400" },

    { name: "chips", url: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400" },
    { name: "popcorn", url: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400" },
    { name: "chocolate", url: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=400" },
    { name: "nuts", url: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400" },
    { name: "biscuits", url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400" },

    { name: "chicken", url: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400" },
    { name: "mutton", url: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400" },
    { name: "sausages", url: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=400" },

    { name: "salmon", url: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400" },
    { name: "prawns", url: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400" },
    { name: "tuna", url: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=400" },

    { name: "frozen-peas", url: "https://images.unsplash.com/photo-1568584711271-61dd5c7e7f8c?w=400" },
    { name: "ice-cream", url: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400" },
    { name: "pizza", url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400" },
    { name: "fries", url: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400" },
    { name: "corn", url: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400" },
];

const outputDir = path.join(__dirname, '..', 'frontend', 'public', 'images', 'products');

// Create directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Download function
function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const filepath = path.join(outputDir, filename);
        const file = fs.createWriteStream(filepath);

        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`✅ Downloaded: ${filename}`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => { });
            console.error(`❌ Error downloading ${filename}:`, err.message);
            reject(err);
        });
    });
}

// Download all images
async function downloadAll() {
    console.log(`📥 Downloading ${products.length} product images...`);
    console.log(`📂 Output directory: ${outputDir}\n`);

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const filename = `${product.name}.jpg`;

        try {
            await downloadImage(product.url, filename);
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
            console.error(`Failed to download ${filename}`);
        }
    }

    console.log(`\n✅ Download complete! Images saved to: ${outputDir}`);
}

downloadAll();
