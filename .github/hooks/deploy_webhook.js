const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/webhook/deploy', (req, res) => {
    const payload = req.body;
    console.log('Deployment webhook received:', payload);
    // Add your deployment logic here
    res.status(200).send('Webhook received!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
