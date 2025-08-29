const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());


const userDetails = {
    full_name: "John Doe", 
    dob: "17091999",       
    email: "john@xyz.com",  
    roll_number: "ABCD123" 
};


app.post('/bfhl', (req, res) => {
    try {
        const { data } = req.body;

        // Basic validation
        if (!data || !Array.isArray(data)) {
            return res.status(400).json({ is_success: false, error: "Invalid data format. 'data' must be an array." });
        }

        const odd_numbers = [];
        const even_numbers = [];
        const alphabets = [];
        const special_characters = [];
        let sum = 0;
        let all_alphabetic_chars = [];

        data.forEach(item => {
            if (!isNaN(item)) {
                // It's a number
                const num = Number(item);
                sum += num;
                if (num % 2 === 0) {
                    even_numbers.push(String(num));
                } else {
                    odd_numbers.push(String(num));
                }
            } else if (/^[a-zA-Z]+$/.test(item)) {
                // It's an alphabet/string of alphabets
                alphabets.push(item.toUpperCase());
                // Collect all individual characters for the concat_string logic
                all_alphabetic_chars.push(...item.split(''));
            } else {
                // It's a special character
                special_characters.push(item);
            }
        });

        // Logic for concat_string
        const reversed_chars = all_alphabetic_chars.reverse();
        const concat_string = reversed_chars.map((char, index) => {
            return index % 2 === 0 ? char.toUpperCase() : char.toLowerCase();
        }).join('');

        const user_id = `${userDetails.full_name.toLowerCase().replace(" ", "_")}_${userDetails.dob}`;

        const response = {
            is_success: true,
            user_id: user_id,
            email: userDetails.email,
            roll_number: userDetails.roll_number,
            odd_numbers: odd_numbers,
            even_numbers: even_numbers,
            alphabets: alphabets,
            special_characters: special_characters,
            sum: String(sum),
            concat_string: concat_string
        };

        res.status(200).json(response);

    } catch (error) {
        res.status(500).json({ is_success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
