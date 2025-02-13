# Secret Santa Game 🎅

A React-based web application for automating Secret Santa gift exchange assignments in a company setting. This application helps organize Secret Santa events by randomly assigning gift recipients while maintaining anonymity and following specific rules.

## Features ✨

- CSV file upload for employee information
- Support for previous year's assignments to avoid repetition
- Automated random assignment generation
- Assignment validation rules:
  - No self-assignments
  - No repeat assignments from previous year
  - Each person gets exactly one gift recipient
  - Each person is assigned as a gift recipient exactly once
- Preview assignments before downloading
- Export assignments as CSV
- Modern, responsive user interface
- Error handling and validation

## Prerequisites 🛠️

Before you begin, ensure you have the following installed:
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

## Installation 📦

1. Clone the repository:
```bash
git clone [your-repository-url]
cd secret-santa-game
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Usage 💡

1. **Prepare Your CSV Files**

   Current Employees CSV format:
   ```csv
   Employee_Name,Employee_EmailID
   John Doe,john.doe@acme.com
   Jane Smith,jane.smith@acme.com
   ```

   Previous Assignments CSV format (optional):
   ```csv
   Employee_Name,Employee_EmailID,Secret_Child_Name,Secret_Child_EmailID
   John Doe,john.doe@acme.com,Jane Smith,jane.smith@acme.com
   ```

2. **Upload Files**
   - Upload the current employees CSV file (required)
   - Upload previous assignments CSV file (optional)

3. **Generate Assignments**
   - Click "Generate Assignments" to create new Secret Santa pairs
   - Preview the assignments in the table

4. **Download Results**
   - Click "Download Assignments" to get the CSV file with new assignments

## Technical Details 🔧

### Project Structure
```
secret-santa-game/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   └── card.jsx
│   │   └── SecretSantaGame.jsx
│   ├── lib/
│   │   └── utils.js
│   ├── App.js
│   └── index.js
├── public/
├── package.json
└── README.md
```

### Dependencies

- React.js - Frontend framework
- Tailwind CSS - Styling
- Papa Parse - CSV parsing
- shadcn/ui - UI components

### Key Components

- `SecretSantaGame.jsx` - Main component handling the game logic
- `card.jsx` - Reusable card component
- `utils.js` - Utility functions for styling

## Error Handling 🚨

The application handles various error cases:
- Invalid CSV format
- Missing required files
- Invalid assignments
- File reading errors

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments 🙏

- Thanks to Acme Company for the project requirements
- shadcn/ui for the beautiful UI components
- All contributors who have helped make this project better

## Support 📧

For support, email [your-email@example.com] or open an issue in the repository.