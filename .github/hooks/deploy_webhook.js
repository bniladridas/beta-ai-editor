const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/webhook/deploy', (req, res) => {
    const payload = req.body;
    console.log('Deployment webhook received:', payload);
    
    // Deployment logic
    exec('npm run build && npm run deploy', (error, stdout, stderr) => {
        if (error) {
            console.error(`Deployment error: ${error.message}`);
            return res.status(500).send('Deployment failed!');
        }
        if (stderr) {
            console.error(`Deployment stderr: ${stderr}`);
            return res.status(500).send('Deployment failed!');
        }
        console.log(`Deployment stdout: ${stdout}`);
        res.status(200).send('Deployment successful!');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
